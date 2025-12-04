"use client";

import { useState } from "react";

interface AuthFormProps {
  type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
  const isLogin = type === "login";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    shopName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/vendor/dashboard";
      }
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-8 rounded-2xl w-full max-w-md">
      <h1 className="text-3xl font-bold mb-4 text-center">
        {isLogin ? "Login" : "Vendor Registration"}
      </h1>

      {error && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">
          {error}
        </p>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              name="name"
              placeholder="Full Name"
              className="w-full border p-3 rounded"
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              className="w-full border p-3 rounded"
              onChange={handleChange}
              required
            />

            <input
              name="shopName"
              placeholder="Shop Name"
              className="w-full border p-3 rounded"
              onChange={handleChange}
              required
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center">
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 font-semibold">
              Register
            </a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold">
              Login
            </a>
          </>
        )}
      </p>
    </div>
  );
}
