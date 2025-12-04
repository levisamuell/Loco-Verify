"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

export default function AdminHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${isScrolled ? "bg-gray-950/90 backdrop-blur-lg border-b border-gray-800" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/admin/dashboard"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Loco Verify · Admin
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/admin/dashboard"
            className="text-gray-300 hover:text-white transition flex items-center gap-1"
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/admin/login";
            }}
            className="text-red-400 hover:text-red-300 transition flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950/95 backdrop-blur-xl border-t border-gray-800 p-6 space-y-4">
          <Link
            href="/admin/dashboard"
            className="block text-gray-300 hover:text-white"
          >
            Dashboard
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/admin/login";
            }}
            className="block text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
