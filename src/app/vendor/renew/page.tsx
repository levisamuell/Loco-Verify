"use client";

import { useState } from "react";
import Layout from "@/components/Layout";

export default function RenewPage() {
  const [licenseId, setLicenseId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Step 1: Send renewal request
    const res = await fetch("/api/licenses/renew", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenseId }),
    });

    if (!res.ok) {
      alert("Renewal request failed");
      setLoading(false);
      return;
    }

    // Step 2: Upload supporting doc if provided
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("licenseId", licenseId);
      fd.append("field", "renewDocument");

      await fetch("/api/uploads", { method: "POST", body: fd });
    }

    setLoading(false);
    alert("Renewal request submitted successfully");
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Request License Renewal</h1>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">License ID</label>
            <input
              value={licenseId}
              onChange={(e) => setLicenseId(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
              placeholder="e.g., lic_12345"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Updated Document (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Request Renewal"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
