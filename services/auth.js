// services/auth.js
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  onAuthStateChanged,
  getIdToken,
} from "firebase/auth";

/**
 * Sign in an existing user with email and password.
 * Returns the Firebase user credential on success.
 */
export async function signIn(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign up a new user and send verification email.
 * Returns the user credential on success.
 */
export async function signUp(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  // Send verification email (non-blocking if you prefer)
  await sendEmailVerification(cred.user);
  return cred;
}

/**
 * Sign out the current user.
 */
export async function logOut() {
  return firebaseSignOut(auth);
}

/**
 * Get the current user's ID token (refresh if needed).
 * Returns a string token or null if no user is signed in.
 */
export async function getCurrentIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return getIdToken(user, /* forceRefresh */ true);
}

/**
 * Subscribe to auth state changes.
 * callback receives (user) where user is Firebase user or null.
 * Returns unsubscribe function.
 */
export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}