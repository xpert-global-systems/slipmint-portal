"use client";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../lib/firebase";

export default function DebugToken() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const t = await user.getIdToken(true);
        setToken(t);
      }
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Firebase Token</h1>
      <textarea
        style={{ width: "100%", height: 200 }}
        value={token}
        readOnly
      />
    </div>
  );
}
