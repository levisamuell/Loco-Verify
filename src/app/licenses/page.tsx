"use client";

import { useEffect, useState } from "react";

export default function LicensesPage() {
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/licenses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLicenses(data.licenses));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Your License Requests</h1>

      <button
        onClick={() => alert("Add Upload License Page")}
        className="px-4 py-2 bg-green-600 text-white rounded mt-4"
      >
        Upload New License
      </button>

      <div className="mt-6 space-y-3">
        {licenses.map((l: any) => (
          <div key={l.id} className="p-4 bg-white shadow rounded">
            <p>
              <b>License Type:</b> {l.licenseType}
            </p>
            <p>
              <b>Status:</b> {l.status}
            </p>
            <p>
              <b>Application Date:</b> {l.applicationDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
