import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

// Fake API (replace later with your backend)
async function registerApi(name: string, email: string, password: string) {
  await new Promise((r) => setTimeout(r, 500));
  if (email.includes("@") && password.length >= 4) {
    return { ok: true, token: "demo-token-456", name };
  }
  return { ok: false, error: "Invalid registration details" };
}

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await registerApi(name, email, password);
    setLoading(false);

    if (res.ok) {
if (res.token) {
  localStorage.setItem("company_token", res.token);
}      localStorage.setItem("company_user", JSON.stringify({ name, email }));
      navigate("/dashboard");
    } else {
      setError(res.error || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow p-8"
      >
        <h2 className="text-2xl font-semibold mb-2">Create an Account</h2>
        <p className="text-sm text-slate-500 mb-6">
          Join your company workspace today.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Full Name</span>
            <div className="relative mt-1">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full border rounded-md px-10 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="John Doe"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full border rounded-md px-10 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="you@company.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full border rounded-md px-10 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>
          </label>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white rounded-md py-2 mt-2 hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-slate-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-green-600 hover:underline"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
