"use client";

import React from "react";
import Header from "@/components/Header";
import {
  UserPlus,
  FileText,
  RefreshCw,
  Shield,
  CheckCircle,
  ArrowRight,
  Zap,
  Lock,
  Clock,
  Database,
  Cloud,
} from "lucide-react";

// Stats widget
const StatCard = ({ number, label }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-blue-400 mb-2">{number}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </div>
);

// Feature widget
const FeatureCard = ({ Icon, title, description }) => (
  <div className="group p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 transition-all duration-300 hover:scale-105 hover:border-blue-500">
    <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
      <Icon className="h-7 w-7 text-blue-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

// Process step widget
const ProcessStep = ({ number, title, description }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0">
      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
        {number}
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* NAVBAR */}
      <Header />

      {/* FULL HERO SECTION */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-gray-950 to-purple-600/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* LEFT SIDE TEXT */}
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
                <Zap className="h-4 w-4" />
                Digital Railway Vendor Licensing
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Loco Verify
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                Transform railway vendor licensing with a unified digital
                platform. Apply, renew, track approvals — 100% online.
              </p>

              {/* CTA BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="/vendor/register"
                  className="group px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 hover:gap-3"
                >
                  Apply as Vendor
                  <ArrowRight className="h-5 w-5" />
                </a>

                <a
                  href="/vendor/login"
                  className="px-8 py-4 border-2 border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all"
                >
                  Vendor Login
                </a>
              </div>

              <a
                href="/admin/login"
                className="text-gray-400 hover:text-blue-400 font-medium transition text-sm flex items-center gap-2 group"
              >
                <Lock className="h-4 w-4" />
                Admin/Officer Login
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* RIGHT SIDE VISUAL */}
            <div className="lg:w-1/2 relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute inset-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20 blur-2xl animate-pulse delay-75"></div>

                {/* Center content */}
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center space-y-6 p-8 bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Shield className="h-12 w-12 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold">100% Digital</h3>
                    <p className="text-gray-400">
                      Secure & Transparent Licensing
                    </p>

                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <StatCard number="24/7" label="Access" />
                      <StatCard number="99%" label="Uptime" />
                      <StatCard number="0" label="Paperwork" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Complete License Management Suite
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <FeatureCard
              Icon={UserPlus}
              title="Vendor Onboarding"
              description="Easy registration & document uploads"
            />
            <FeatureCard
              Icon={FileText}
              title="Digital Review"
              description="Officers verify applications online"
            />
            <FeatureCard
              Icon={RefreshCw}
              title="Auto Renewals"
              description="Get reminders & renew licenses easily"
            />
            <FeatureCard
              Icon={Shield}
              title="Secure Platform"
              description="Bank-level security & encrypted workflows"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16">
          {/* Left column */}
          <div>
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg mb-8">
              Get your railway vendor license approved in four simple steps.
            </p>

            <div className="space-y-8">
              <ProcessStep
                number="1"
                title="Register Account"
                description="Enter vendor details & create your profile"
              />
              <ProcessStep
                number="2"
                title="Upload Documents"
                description="ID proofs, shop images, license category"
              />
              <ProcessStep
                number="3"
                title="Digital Verification"
                description="Railway officer reviews & verifies"
              />
              <ProcessStep
                number="4"
                title="Approval"
                description="Receive downloadable digital license"
              />
            </div>
          </div>

          {/* Right column widgets */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <Clock className="h-8 w-8 text-blue-400 mb-3" />
                <h3 className="font-semibold mb-2">Fast Processing</h3>
                <p className="text-gray-400 text-sm">
                  Average approval: 48 hours
                </p>
              </div>

              <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                <CheckCircle className="h-8 w-8 text-green-400 mb-3" />
                <h3 className="font-semibold mb-2">Real-Time Updates</h3>
                <p className="text-gray-400 text-sm">Track status anytime</p>
              </div>
            </div>

            <div className="space-y-6 pt-12">
              <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <Database className="h-8 w-8 text-purple-400 mb-3" />
                <h3 className="font-semibold mb-2">Cloud Storage</h3>
                <p className="text-gray-400 text-sm">Secure document storage</p>
              </div>

              <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-2x">
                <Cloud className="h-8 w-8 text-orange-400 mb-3" />
                <h3 className="font-semibold mb-2">Always Available</h3>
                <p className="text-gray-400 text-sm">
                  Access anywhere, anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-gray-950 border-t border-gray-800 text-center text-gray-500 text-sm">
        © 2025 Loco Verify — Digital Railway Vendor Licensing Platform
      </footer>
    </div>
  );
}
