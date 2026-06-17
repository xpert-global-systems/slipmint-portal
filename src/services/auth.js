import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

import { auth } from "../lib/firebaseClient";

// SIGNUP
export const signup = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await sendEmailVerification(userCredential.user);

  return {
    success: true,
    user: userCredential.user,
  };
};

// LOGIN
export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  if (!user.emailVerified) {
    await signOut(auth);
    return {
      success: false,
      message: "Please verify your email before logging in.",
    };
  }

  const token = await user.getIdToken();

  return {
    success: true,
    token,
    user,
  };
};

// LOGOUT
export const logout = async () => {
  await signOut(auth);
};