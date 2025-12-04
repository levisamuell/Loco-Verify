"use client";

import { useState } from "react";
import { ArrowRight, Upload } from "lucide-react";

export default function ApplyPage() {
  const [licenseType, setLicenseType] = useState("");
  const [idProof, setIdProof] = useState<File | null>(null);
  const [shopPhoto, setShopPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!user?.id || !token) {
      setMessage("You must be logged in.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("vendorId", user.id);
      formData.append("licenseType", licenseType);
      if (idProof) formData.append("idProof", idProof);
      if (shopPhoto) formData.append("shopPhoto", shopPhoto);

      const res = await fetch("/api/licenses/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong.");
      } else {
        setMessage("🎉 Application submitted successfully!");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error submitting application.");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto pt-20 pb-20">
      <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Apply for New License
      </h1>

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-10 shadow-xl backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* License Type */}
          <div>
            <label className="block mb-2 font-semibold text-gray-200">
              License Type
            </label>
            <select
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
              value={licenseType}
              onChange={(e) => setLicenseType(e.target.value)}
              required
            >
              <option value="" className="text-gray-400">
                Select Type
              </option>
              <option value="Tea Stall">Tea Stall</option>
              <option value="Book Shop">Book Shop</option>
              <option value="Food Counter">Food Counter</option>
            </select>
          </div>

          {/* ID Proof */}
          <div>
            <label className="block mb-2 font-semibold text-gray-200">
              Upload ID Proof
            </label>
            <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 p-3 rounded-xl cursor-pointer hover:border-blue-500 transition">
              <Upload className="text-blue-400 w-5 h-5" />
              <input
                type="file"
                className="text-gray-300"
                onChange={(e) => setIdProof(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>

          {/* Shop Photo */}
          <div>
            <label className="block mb-2 font-semibold text-gray-200">
              Upload Shop Photo
            </label>
            <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 p-3 rounded-xl cursor-pointer hover:border-purple-500 transition">
              <Upload className="text-purple-400 w-5 h-5" />
              <input
                type="file"
                className="text-gray-300"
                onChange={(e) => setShopPhoto(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-6 py-3 rounded-xl font-semibold text-lg
              bg-gradient-to-r from-blue-600 to-purple-600 text-white
              hover:from-blue-500 hover:to-purple-500
              flex items-center justify-center gap-2 shadow-lg transition
            "
          >
            {loading ? "Submitting..." : "Submit Application"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {message && (
          <p className="text-center mt-6 text-lg text-blue-300 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
