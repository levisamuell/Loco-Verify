"use client";

import { useEffect, useState } from "react";

export default function VendorDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      window.location.href = "/login";
      return;
    }

    setUser(JSON.parse(userData));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
      <p>Welcome, {user.name}</p>

      <div className="bg-white shadow p-4 rounded">
        <h2 className="font-semibold text-xl">Your Shop</h2>
        <p>
          <b>Shop Name:</b> {user.shopName}
        </p>
        <p>
          <b>Phone:</b> {user.phone}
        </p>
      </div>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => (window.location.href = "/licenses")}
      >
        View License Requests
      </button>
    </div>
  );
}
