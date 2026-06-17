import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  reload,
} from "firebase/auth";

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
 */
export async function getUser() {
  try {
    const user = auth.currentUser;

    if (!user) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    await reload(user);

    const token = await user.getIdToken(true);

    return {
      success: true,
      token,
      user: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
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