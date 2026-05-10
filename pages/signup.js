import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, fullName, phone, occupation } = e.target.elements;

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;

      // Save extra details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName.value,
        phone: phone.value,
        occupation: occupation.value,
        email: email.value,
      });

      alert("Signup successful!");
    } catch (err) {
      console.error(err);
      alert("Signup failed.");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" required />
        <input type="text" name="phone" placeholder="Phone Number" required />
        <input type="text" name="occupation" placeholder="Occupation" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
