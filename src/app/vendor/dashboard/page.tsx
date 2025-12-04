"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import {
  User,
  FileText,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Upload,
  CheckCircle,
} from "lucide-react";

export default function VendorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user + fetch license data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      router.push("/vendor/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Fetch vendor licenses
    fetch("/api/licenses/vendor", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setLicenses(data?.data || []);
        setLoading(false);
      });
  }, [router]);

  if (loading)
    return (
      <div className="text-center text-gray-300 p-10">Loading Dashboard…</div>
    );

  const latest = licenses[0];

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 pt-32 pb-20">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-10">
        Vendor Dashboard
      </h1>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <User className="text-blue-400 h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Your Profile</h2>
          </div>

          <div className="space-y-3 text-gray-300">
            <p>
              <span className="text-gray-400">Name:</span> {user.name}
            </p>
            <p>
              <span className="text-gray-400">Email:</span> {user.email}
            </p>
            <p>
              <span className="text-gray-400">Phone:</span>{" "}
              {user.phone ?? "N/A"}
            </p>
            <p>
              <span className="text-gray-400">Shop:</span> {user.shopName}
            </p>
          </div>
        </div>

        {/* License Summary */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-purple-400 h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Your License Status</h2>
          </div>

          {/* No license yet */}
          {!latest ? (
            <div className="text-gray-400 mb-6">
              You haven't applied for any license yet.
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              <p>
                <span className="text-gray-400">License Type:</span>{" "}
                {latest.licenseType}
              </p>

              <p className="flex items-center gap-2">
                <span className="text-gray-400">Status:</span>
                <StatusBadge status={latest.status} />
              </p>

              {latest.issueDate && (
                <p>
                  <span className="text-gray-400">Issued:</span>{" "}
                  {new Date(latest.issueDate).toLocaleDateString()}
                </p>
              )}

              {latest.expiryDate && (
                <p>
                  <span className="text-gray-400">Expires:</span>{" "}
                  {new Date(latest.expiryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {!latest && (
              <button
                onClick={() => router.push("/vendor/apply")}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
              >
                Apply for License <ArrowRight className="h-5 w-5" />
              </button>
            )}

            {/* Renewal button if approved */}
            {latest?.status === "APPROVED" && (
              <button
                onClick={() => router.push("/vendor/renew")}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition flex items-center gap-2"
              >
                Renew License <CheckCircle className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={() => router.push("/vendor/upload")}
              className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition flex items-center gap-2"
            >
              Upload Documents <Upload className="h-5 w-5" />
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                router.push("/vendor/login");
              }}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition flex items-center gap-2"
            >
              Logout <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* DOCUMENTS SECTION */}
      {latest && (
        <div className="mt-12 p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-400" />
            Submitted Documents
          </h2>

          <div className="space-y-2 text-gray-300">
            <p>
              <span className="text-gray-400">ID Proof:</span>{" "}
              {latest.idProofLink ? (
                <a
                  href={latest.idProofLink}
                  target="_blank"
                  className="text-blue-400 hover:underline"
                  rel="noreferrer"
                >
                  View File
                </a>
              ) : (
                "Not uploaded"
              )}
            </p>

            <p>
              <span className="text-gray-400">Shop Photo:</span>{" "}
              {latest.shopPhotoLink ? (
                <a
                  href={latest.shopPhotoLink}
                  target="_blank"
                  className="text-blue-400 hover:underline"
                  rel="noreferrer"
                >
                  View File
                </a>
              ) : (
                "Not uploaded"
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
