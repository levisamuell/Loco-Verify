"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add scroll effect → transparent becomes solid on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Loco Verify
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/vendor/register"
            className="text-gray-300 hover:text-white transition"
          >
            Apply as Vendor
          </Link>
          <Link
            href="/vendor/login"
            className="text-gray-300 hover:text-white transition"
          >
            Vendor Login
          </Link>
          <Link
            href="/admin/login"
            className="text-gray-300 hover:text-white transition"
          >
            Admin Login
          </Link>
        </nav>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE NAV MENU */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950/95 backdrop-blur-xl border-t border-gray-800 p-6 space-y-4">
          <Link
            href="/vendor/register"
            className="block text-gray-300 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Apply as Vendor
          </Link>
          <Link
            href="/vendor/login"
            className="block text-gray-300 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Vendor Login
          </Link>
          <Link
            href="/admin/login"
            className="block text-gray-300 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Admin Login
          </Link>
        </div>
      )}
    </header>
  );
}
