"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      authAPI
        .verify()
        .then(() => {
          router.replace("/admin");
        })
        .catch(() => {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          setCheckingAuth(false);
        });
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      if (res.data && res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        if (res.data.admin) {
          localStorage.setItem("adminUser", JSON.stringify(res.data.admin));
        }
        toast.success("Welcome back, Abhishek!");
        router.push("/admin");
      } else {
        toast.error("Login failed: Invalid server response");
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        "Invalid credentials or server not responding";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col justify-between relative overflow-hidden px-4 py-8">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar with back link */}
      <div className="w-full max-w-md mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>
      </div>

      {/* Card container */}
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="bg-[#12121a]/80 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-8 shadow-2xl shadow-indigo-950/40">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 mx-auto mb-6">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-space bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              Admin Portal
            </h1>
            <p className="text-xs text-gray-400 mt-2">
              Sign in with your admin credentials to manage requests, messages & projects.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full bg-[#181824] border border-gray-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#181824] border border-gray-800 focus:border-indigo-500 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer mt-6"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick helper tip */}
          <div className="mt-6 pt-5 border-t border-gray-800/80 text-center">
            <p className="text-[11px] text-gray-500">
              Credentials configured in <code className="text-indigo-400 bg-indigo-950/40 px-1 py-0.5 rounded">backend/.env</code>
            </p>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="w-full max-w-md mx-auto text-center text-xs text-gray-600">
        Technorats Portfolio Admin • Abhishek Yadav
      </div>
    </div>
  );
}
