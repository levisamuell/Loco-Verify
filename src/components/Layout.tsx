"use client";

import React from "react";
import Header from "@/components/Header";

export default function Layout({
  children,
  fullWidth = false,
}: {
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className="min-h-screen text-white bg-gray-950 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-gray-950 to-purple-600/20 pointer-events-none"></div>

      {/* Navbar */}
      <Header />

      {/* Page Wrapper */}
      <main
        className={`relative z-10 ${
          fullWidth ? "" : "max-w-6xl mx-auto px-6 py-16"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
