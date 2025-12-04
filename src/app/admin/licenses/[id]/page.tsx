"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Calendar,
  ShieldCheck,
} from "lucide-react";

export default function AdminLicenseDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [license, setLicense] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch license details
  useEffect(() => {
    const fetchLicense = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        setLicense(null);
        return;
      }

      const res = await fetch(`/api/admin/licenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await res.json();

      // API returns { data: license }
      if (response?.data) {
        setLicense(response.data);
      } else {
        setLicense(null);
      }

      setLoading(false);
    };

    fetchLicense();
  }, [id]);

  if (loading)
    return (
      <div className="text-center text-gray-300 p-10">Loading license…</div>
    );

  if (!license)
    return (
      <div className="text-center text-red-400 p-10">
        License not found or unauthorized.
      </div>
    );

  const vendor = license.vendor || {}; // 👈 prevent undefined errors

  // Approve
  const approveLicense = async () => {
    const token = localStorage.getItem("token");

    await fetch(`/api/admin/licenses/${id}/approve`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("License approved successfully!");
    router.refresh();
  };

  // Reject
  const rejectLicense = async () => {
    const token = localStorage.getItem("token");

    await fetch(`/api/admin/licenses/${id}/reject`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("License rejected successfully!");
    router.refresh();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 text-white pt-28 px-6 max-w-4xl mx-auto">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="h-5 w-5" /> Back to Dashboard
        </button>

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          License Details
        </h1>

        {/* LICENSE CARD */}
        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 shadow-xl space-y-8">
          {/* License Information */}
          <section>
            <h2 className="text-2xl font-semibold flex items-center gap-3 mb-5">
              <ShieldCheck className="h-7 w-7 text-purple-400" />
              License Information
            </h2>

            <div className="space-y-3 text-gray-300">
              <p>
                <span className="text-gray-400">License Type:</span>{" "}
                {license.licenseType}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">Status:</span>
                <StatusBadge status={license.status} />
              </p>

              <p className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                Applied On:
                <span className="text-gray-200">
                  {new Date(license.applicationDate).toLocaleDateString()}
                </span>
              </p>

              {license.issueDate && (
                <p>
                  <span className="text-gray-400">Issued On:</span>{" "}
                  {new Date(license.issueDate).toLocaleDateString()}
                </p>
              )}

              {license.expiryDate && (
                <p>
                  <span className="text-gray-400">Expires On:</span>{" "}
                  {new Date(license.expiryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </section>

          {/* Vendor Information */}
          <section>
            <h2 className="text-2xl font-semibold flex items-center gap-3 mb-5">
              <User className="h-7 w-7 text-blue-400" />
              Vendor Details
            </h2>

            <div className="space-y-2 text-gray-300">
              <p>
                <span className="text-gray-400">Name:</span>{" "}
                {vendor.name || "N/A"}
              </p>
              <p>
                <span className="text-gray-400">Email:</span>{" "}
                {vendor.email || "N/A"}
              </p>
              <p>
                <span className="text-gray-400">Phone:</span>{" "}
                {vendor.phone || "N/A"}
              </p>
              <p>
                <span className="text-gray-400">Shop Name:</span>{" "}
                {vendor.shopName || "N/A"}
              </p>
            </div>
          </section>

          {/* DOCUMENTS */}
          <section>
            <h2 className="text-2xl font-semibold flex items-center gap-3 mb-5">
              <FileText className="h-7 w-7 text-green-400" />
              Submitted Documents
            </h2>

            <div className="space-y-3">
              <p>
                <span className="text-gray-400">ID Proof:</span>{" "}
                {license.idProofLink ? (
                  <a
                    href={license.idProofLink}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                    rel="noreferrer"
                  >
                    View Document
                  </a>
                ) : (
                  "Not uploaded"
                )}
              </p>

              <p>
                <span className="text-gray-400">Shop Photo:</span>{" "}
                {license.shopPhotoLink ? (
                  <a
                    href={license.shopPhotoLink}
                    target="_blank"
                    className="text-purple-400 hover:underline"
                    rel="noreferrer"
                  >
                    View Document
                  </a>
                ) : (
                  "Not uploaded"
                )}
              </p>
            </div>
          </section>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 pt-6">
            {license.status === "PENDING" && (
              <>
                <button
                  onClick={approveLicense}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700 text-white font-semibold"
                >
                  <CheckCircle className="h-5 w-5" />
                  Approve
                </button>

                <button
                  onClick={rejectLicense}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 text-white font-semibold"
                >
                  <XCircle className="h-5 w-5" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
