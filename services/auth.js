import { auth } from “../lib/firebase”;
import {
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
signOut,
} from “firebase/auth”;

export async function login(email, password) {
try {
const cred = await signInWithEmailAndPassword(
auth,
email,
password
);

const token = await cred.user.getIdToken();
return {
  success: true,
  token,
  user: {
    uid: cred.user.uid,
    email: cred.user.email,
  },
};

} catch (err) {
return {
success: false,
message: err.message,
};
}
}

export async function signup(fullName, email, password) {
try {
const cred = await createUserWithEmailAndPassword(
auth,
email,
password
);

const token = await cred.user.getIdToken();
return {
  success: true,
  token,
  user: {
    uid: cred.user.uid,
    email: cred.user.email,
    fullName,
  },
};

} catch (err) {
return {
success: false,
message: err.message,
};
}
}

export async function logout() {
try {
await signOut(auth);

return {
  success: true,
};

} catch (err) {
return {
success: false,
message: err.message,
};
}
}

export async function getUser() {
try {
const user = auth.currentUser;

if (!user) {
  return {
    success: false,
    message: "Not authenticated",
  };
}
const token = await user.getIdToken();
return {
  success: true,
  token,
  user: {
    uid: user.uid,
    email: user.email,
  },
};

} catch (err) {
return {
success: false,
message: err.message,
};
}
}