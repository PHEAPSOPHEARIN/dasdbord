import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import { motion } from "framer-motion";

// Example API call (replace with real backend later)
async function loginApi(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 500));
  if (email === "user@company.com" && password === "password") {
    return { ok: true, token: "demo-token-123", name: "Demo User" };
  }
  return { ok: false, error: "Invalid email or password" };
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await loginApi(email, password);
    setLoading(false);

    if (res.ok) {
      localStorage.setItem("company_token", res.token);
      localStorage.setItem("company_user", JSON.stringify({ name: res.name, email }));
      navigate("/dashboard");
    } else {
      setError(res.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow p-8"
      >
        <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
        <p className="text-sm text-slate-500 mb-6">Sign in to your company dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <div className="relative mt-1">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-md px-10 py-2 focus:ring-2 focus:ring-sky-500"
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
                className="w-full border rounded-md px-10 py-2 focus:ring-2 focus:ring-sky-500"
                placeholder="••••••••"
              />
            </div>
          </label>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 text-white rounded-md py-2 mt-2 hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-slate-500">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-sky-600 hover:underline"
          >
            Register
          </button>
        </p>
      </motion.div>
    </div>
  );
}
