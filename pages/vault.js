import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Link from "next/link";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const vaultItems = [
  {
    title: "Founder Notes",
    summary: "Private thinking, strategy notes, and structured crypto observations.",
  },
  {
    title: "Premium Research",
    summary: "Deeper market breakdowns and higher-conviction research pieces.",
  },
  {
    title: "Strategic Watchlist",
    summary: "A curated view of themes, narratives, and assets worth monitoring.",
  },
];

export default function Vault() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  // Track auth state and look up subscription tier
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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

    return () => unsubscribe();
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
      const token = await user.getIdToken();
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

          {checkingAccess || verifying ? (
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
            <div style={styles.grid}>
              {vaultItems.map((item, index) => (
                <article key={index} style={styles.card}>
                  <h2 style={styles.cardTitle}>{item.title}</h2>
                  <p style={styles.cardText}>{item.summary}</p>
                </article>
              ))}
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
  },
};
