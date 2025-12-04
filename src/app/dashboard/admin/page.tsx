"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <h2 className="text-xl mt-4 mb-2 font-semibold">All Vendors</h2>

      <div className="space-y-3">
        {users.map((u: any) => (
          <div
            key={u.id}
            className="p-4 bg-white shadow rounded border-l-4 border-blue-500"
          >
            <p>
              <b>Name:</b> {u.name}
            </p>
            <p>
              <b>Email:</b> {u.email}
            </p>
            <p>
              <b>Role:</b> {u.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
