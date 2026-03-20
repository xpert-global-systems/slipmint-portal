import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Balance: {data.balance ?? 0}</p>

      <h3>Activity</h3>
      <ul>
        {data.activity.map((a, i) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </div>
  );
}
