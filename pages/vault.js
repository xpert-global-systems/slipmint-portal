import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Link from "next/link";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";

const CATEGORIES = [
  { value: "founder_notes", label: "Founder Notes" },
  { value: "premium_research", label: "Premium Research" },
  { value: "watchlist", label: "Strategic Watchlist" },
];

// If Firebase's auth listener never fires (e.g. the network-request-failed
// issue), don't leave the user staring at "Checking your access..." forever.
const AUTH_CHECK_TIMEOUT_MS = 10000;

export default function Vault() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [authTimedOut, setAuthTimedOut] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState("");

  // Once access is confirmed, load the real vault content (gated server-side
  // by Firestore security rules, not just this client-side check — see
  // firestore.rules in the repo root).
  useEffect(() => {
    if (!hasAccess) return;

    setLoadingContent(true);
    setContentError("");

    const q = query(
      collection(db, "vaultContent"),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );

    getDocs(q)
      .then((snap) => setContent(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch((err) => {
        console.error("Failed to load vault content:", err);
        // Surface it instead of silently showing "check back soon" — this is
        // usually a missing Firestore composite index (published + createdAt)
        // rather than an actual empty vault.
        setContentError(
          "We couldn't load vault content right now. Please refresh, or contact support if this keeps happening."
        );
      })
      .finally(() => setLoadingContent(false));
  }, [hasAccess]);

  // Track auth state and look up subscription tier, with a timeout so a
  // silent network failure doesn't leave the page stuck on "Checking your
  // access..." indefinitely.
  useEffect(() => {
    let settled = false;

    const timeoutId = setTimeout(() => {
      if (!settled) {
        setAuthTimedOut(true);
        setCheckingAccess(false);
      }
    }, AUTH_CHECK_TIMEOUT_MS);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      settled = true;
      clearTimeout(timeoutId);
      setAuthTimedOut(false);
      setUser(firebaseUser);

      if (!firebaseUser) {
        setHasAccess(false);
        setCheckingAccess(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const tier = userDoc.exists() ? userDoc.data()?.subscription?.tier : "free";
        setHasAccess(tier === "founder");
      } catch (err) {
        console.error("Failed to check subscription:", err);
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    });

    return () => {
      settled = true;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  // If we just came back from Paystack with a reference, verify it
  useEffect(() => {
    const { ref } = router.query;
    if (!ref || !user) return;

    setVerifying(true);
    setError("");

    fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: ref }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHasAccess(true);
        } else {
          setError(data.message || "We couldn't confirm this payment yet.");
        }
      })
      .catch(() => setError("Payment verification failed. If you were charged, contact support."))
      .finally(() => {
        setVerifying(false);
        // Clean the ref param out of the URL so refreshing doesn't re-verify
        router.replace("/vault", undefined, { shallow: true });
      });
  }, [router.query, user]);

  async function handleSubscribe() {
    if (!user) {
      router.push("/login");
      return;
    }

    setSubscribing(true);
    setError("");

    try {
      // Force-refresh: an about-to-expire cached token can get rejected by
      // /api/subscribe's verifyIdToken, causing a confusing failure right at
      // checkout.
      const token = await user.getIdToken(true);
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Could not start checkout");
      }

      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err.message);
      setSubscribing(false);
    }
  }

  function handleRetryAuthCheck() {
    setAuthTimedOut(false);
    setCheckingAccess(true);
    // Re-running the effect requires a fresh mount of the check; simplest
    // reliable way from a plain function is a full reload.
    window.location.reload();
  }

  return (
    <Layout>
      <section style={styles.page}>
        <div style={styles.container}>
          <span style={styles.tag}>Founder Vault</span>
          <h1 style={styles.title}>Private research and strategic access</h1>
          <p style={styles.subtitle}>
            The Founder Vault gives members access to premium SlipMint content,
            deeper research, and curated strategic insights.
          </p>

          {authTimedOut ? (
            <div style={styles.lockedCard}>
              <h2 style={styles.lockedTitle}>Connection problem</h2>
              <p style={styles.lockedText}>
                We couldn't reach the authentication service. This is usually
                temporary — check your connection and try again.
              </p>
              <div style={styles.actions}>
                <button
                  onClick={handleRetryAuthCheck}
                  style={{ ...styles.primaryButton, border: "none", cursor: "pointer" }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : checkingAccess || verifying ? (
            <div style={styles.lockedCard}>
              <p style={styles.lockedText}>
                {verifying ? "Confirming your payment..." : "Checking your access..."}
              </p>
            </div>
          ) : !hasAccess ? (
            <div style={styles.lockedCard}>
              <h2 style={styles.lockedTitle}>Members only</h2>
              <p style={styles.lockedText}>
                This section is currently locked. Subscribe to unlock premium
                research and private founder content for ₦55,000/month.
              </p>

              {error && <p style={styles.errorText}>{error}</p>}

              <div style={styles.actions}>
                {user ? (
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    style={{ ...styles.primaryButton, opacity: subscribing ? 0.6 : 1, border: "none", cursor: "pointer" }}
                  >
                    {subscribing ? "Redirecting..." : "Subscribe — ₦55,000/mo"}
                  </button>
                ) : (
                  <Link href="/login" style={styles.primaryButton}>
                    Login to Subscribe
                  </Link>
                )}
                <Link href="/research" style={styles.secondaryButton}>
                  View Free Research
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {loadingContent && <p style={styles.lockedText}>Loading vault content...</p>}

              {contentError && (
                <div style={styles.lockedCard}>
                  <p style={styles.errorText}>{contentError}</p>
                </div>
              )}

              {!loadingContent && !contentError && content.length === 0 && (
                <div style={styles.lockedCard}>
                  <p style={styles.lockedText}>
                    New research and notes are added regularly — check back soon.
                  </p>
                </div>
              )}

              {CATEGORIES.map((cat) => {
                const items = content.filter((c) => c.category === cat.value);
                if (items.length === 0) return null;
                return (
                  <div key={cat.value} style={{ marginBottom: "40px" }}>
                    <h2 style={styles.sectionTitle}>{cat.label}</h2>
                    <div style={styles.grid}>
                      {items.map((item) => (
                        <article key={item.id} style={styles.card}>
                          <h3 style={styles.cardTitle}>{item.title}</h3>
                          <p style={styles.cardText}>{item.body}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#081120",
    color: "#fff",
    padding: "40px 20px 60px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  tag: {
    display: "inline-block",
    color: "#22c55e",
    fontWeight: 700,
    marginBottom: "12px",
  },
  title: {
    fontSize: "40px",
    margin: "0 0 14px",
  },
  subtitle: {
    color: "#b8c7d9",
    fontSize: "18px",
    lineHeight: 1.7,
    maxWidth: "760px",
    marginBottom: "30px",
  },
  lockedCard: {
    background: "#0f1b2d",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "28px",
  },
  lockedTitle: {
    margin: "0 0 12px",
    fontSize: "28px",
  },
  lockedText: {
    margin: "0 0 22px",
    color: "#b8c7d9",
    lineHeight: 1.7,
    maxWidth: "720px",
  },
  errorText: {
    color: "#f87171",
    marginBottom: "16px",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },
  primaryButton: {
    display: "inline-block",
    textDecoration: "none",
    padding: "14px 22px",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "15px",
    background: "#22c55e",
    color: "#081120",
  },
  secondaryButton: {
    display: "inline-block",
    textDecoration: "none",
    padding: "14px 22px",
    borderRadius: "12px",
    fontWeight: 700,
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#ffffff",
    background: "rgba(255,255,255,0.05)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#0f1b2d",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "22px",
  },
  cardTitle: {
    margin: "0 0 10px",
    fontSize: "22px",
  },
  cardText: {
    margin: 0,
    color: "#b8c7d9",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: 700,
    margin: "0 0 18px",
    color: "#ffffff",
  },
};
