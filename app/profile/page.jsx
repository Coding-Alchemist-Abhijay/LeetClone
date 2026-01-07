'use client';

import { useEffect, useState } from "react";

export default function ProfileClient() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/users/me", {
        credentials: "include",
      });

      const data = await res.json();
      setUser(data.user);
      setLoading(false);
    }

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
