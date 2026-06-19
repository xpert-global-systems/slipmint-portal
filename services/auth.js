import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  reload,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * LOGIN
 */
export async function login(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 🔥 ensure latest emailVerified status
    await reload(cred.user);

    // BLOCK UNVERIFIED USERS
    if (!cred.user.emailVerified) {
      await signOut(auth);

      return {
        success: false,
        message: "Email not verified. Please check your inbox.",
      };
    }

    const token = await cred.user.getIdToken(true);

    return {
      success: true,
      token,
      user: {
        uid: cred.user.uid,
        email: cred.user.email,
        emailVerified: cred.user.emailVerified,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}

/**
 * SIGNUP
 */
export async function signup(email, password) {
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // send verification email immediately
    await sendEmailVerification(cred.user);

    const token = await cred.user.getIdToken(true);

    return {
      success: true,
      token,
      user: {
        uid: cred.user.uid,
        email: cred.user.email,
        emailVerified: cred.user.emailVerified,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}

/**
 * LOGOUT
 */
export async function logout() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}

/**
 * GET CURRENT USER
 *
 * Firebase's auth state is restored asynchronously on page load.
 * Reading `auth.currentUser` immediately after a refresh can return
 * null even when the user IS logged in, because Firebase hasn't
 * finished rehydrating the session yet. This waits for that first
 * state event before deciding the user is logged out.
 *
 * It also pulls the user's Firestore profile doc (users/{uid}) so
 * fields like `subscription.tier` are actually available — the old
 * version only ever returned uid/email/emailVerified, which is why
 * tier always fell back to "free".
 */
export async function getUser() {
  try {
    const user = await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        unsubscribe();
        resolve(firebaseUser);
      });
    });

    if (!user) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    await reload(user);

    if (!user.emailVerified) {
      return {
        success: false,
        message: "Email not verified. Please check your inbox.",
      };
    }

    const token = await user.getIdToken(true);

    // Pull the Firestore profile so subscription/tier data is included.
    let profile = {};
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        profile = snap.data();
      }
    } catch (profileErr) {
      // Don't fail the whole getUser() call if the profile read fails —
      // the user is still authenticated, just without extra profile data.
      console.error("Failed to load user profile:", profileErr);
    }

    return {
      success: true,
      token,
      user: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        ...profile,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}

/**
 * AUTH LISTENER
 */
export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
