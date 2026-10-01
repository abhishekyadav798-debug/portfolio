"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI, adminAPI, requestsAPI, contactAPI, projectsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  FolderGit2,
  Settings,
  LogOut,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Mail,
  User,
  DollarSign,
  Calendar,
  Send,
  Globe,
  Key,
  Database
} from "lucide-react";

interface Stats {
  totalProjects: number;
  publishedProjects: number;
  totalRequests: number;
  newRequests: number;
  activeRequests: number;
  completedRequests: number;
  totalMessages: number;
  unreadMessages: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "requests" | "messages" | "projects" | "deploy">("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Data states
  const [stats, setStats] = useState<Stats | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"online" | "offline" | "db_pending">("online");

  const verifyAndLoadData = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    try {
      const verifyRes = await authAPI.verify();
      const user = verifyRes.data?.user || JSON.parse(localStorage.getItem("adminUser") || "{}");
      setAdminUser(user);
    } catch {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      router.replace("/admin/login");
      return;
    }

    try {
      setRefreshing(true);
      // Fetch stats
      try {
        const statsRes = await adminAPI.getStats();
        if (statsRes.data?.stats) {
          setStats(statsRes.data.stats);
          setBackendStatus("online");
        }
      } catch (err: any) {
        if (err.response?.status === 500) {
          setBackendStatus("db_pending");
        } else {
          setBackendStatus("offline");
        }
      }

      // Fetch Requests
      try {
        const reqRes = await requestsAPI.getAll();
        setRequests(reqRes.data?.requests || []);
      } catch {
        // quiet fallback
      }

      // Fetch Contact Messages
      try {
        const msgRes = await contactAPI.getAll();
        setMessages(msgRes.data?.messages || []);
      } catch {
        // quiet fallback
      }

      // Fetch Projects
      try {
        const projRes = await projectsAPI.getAll();
        setProjects(projRes.data?.projects || []);
      } catch {
        // quiet fallback
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    verifyAndLoadData();
  }, [verifyAndLoadData]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      await requestsAPI.updateStatus(requestId, newStatus, statusNote);
      toast.success(`Request status updated to ${newStatus}`);
      setStatusNote("");
      verifyAndLoadData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleMarkMessageRead = async (messageId: string) => {
    try {
      await contactAPI.markRead(messageId);
      toast.success("Marked as read");
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, isRead: true } : m))
      );
    } catch {
      toast.error("Failed to update message status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#101018]/90 backdrop-blur-md border-b border-gray-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
              <span className="font-space font-bold text-lg bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                Technorats
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Admin
              </span>
            </Link>

            {/* Server Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-[#181824] border border-gray-800">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus === "online"
                    ? "bg-emerald-500 shadow-sm shadow-emerald-500"
                    : backendStatus === "db_pending"
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
              />
              <span className="text-gray-400">
                API:{" "}
                <span className="text-gray-200 font-medium capitalize">
                  {backendStatus === "online"
                    ? "Live & DB Connected"
                    : backendStatus === "db_pending"
                    ? "Server Live (DB Pending Atlas Setup)"
                    : "Offline"}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={verifyAndLoadData}
              disabled={refreshing}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/60 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-indigo-400" : ""}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white px-3 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="hidden sm:block text-right pl-2 border-l border-gray-800">
              <p className="text-xs font-semibold text-white leading-tight">
                {adminUser?.name || "Abhishek Yadav"}
              </p>
              <p className="text-[10px] text-gray-400">{adminUser?.email || "admin"}</p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-800/80">
          <button
            onClick={() => setActiveTab("overview")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${
              activeTab === "requests"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <Inbox className="w-4 h-4" />
            Project Requests
            {requests.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-400 text-gray-900 font-bold">
                {requests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${
              activeTab === "messages"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Messages
            {messages.filter((m) => !m.isRead).length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                {messages.filter((m) => !m.isRead).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "projects"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            Projects
          </button>

          <button
            onClick={() => setActiveTab("deploy")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "deploy"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <Globe className="w-4 h-4" />
            Deploy & .IN Domain Setup
          </button>
        </div>

        {/* Database notice banner if MongoDB is not connected */}
        {backendStatus === "db_pending" && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200">
              <span className="font-semibold text-amber-300">MongoDB Connection Required:</span> The
              backend is running, but MongoDB needs a free cloud connection string (MongoDB Atlas URI in{" "}
              <code className="bg-amber-950/60 px-1 py-0.5 rounded text-white">backend/.env</code>).
              Once connected, all requests, messages, and stats will persist permanently. See the{" "}
              <button
                onClick={() => setActiveTab("deploy")}
                className="underline font-semibold hover:text-white"
              >
                Deploy & .IN Domain tab
              </button>{" "}
              for step-by-step setup.
            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-5 hover:border-indigo-500/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">Total Requests</span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Inbox className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-space text-white">
                  {stats?.totalRequests ?? requests.length}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Client project inquiries</p>
              </div>

              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">Active In-Progress</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-space text-emerald-400">
                  {stats?.activeRequests ?? 0}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Under development</p>
              </div>

              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-5 hover:border-purple-500/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">Total Messages</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-space text-white">
                  {stats?.totalMessages ?? messages.length}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  {stats?.unreadMessages ?? messages.filter((m) => !m.isRead).length} unread
                </p>
              </div>

              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-5 hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">Showcase Projects</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-space text-white">
                  {stats?.totalProjects ?? (projects.length || 6)}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Live portfolio works</p>
              </div>
            </div>

            {/* Quick Actions & Recent Snapshot */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Requests Preview */}
              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-white">Recent Project Requests</h3>
                  <button
                    onClick={() => setActiveTab("requests")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View All →
                  </button>
                </div>

                {requests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    No requests submitted yet. When a client fills out the Quote form on the portfolio, it will appear here instantly!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {requests.slice(0, 4).map((req) => (
                      <div
                        key={req._id || req.requestId}
                        className="p-3 bg-[#181824] rounded-xl border border-gray-800 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-medium text-white">{req.name}</p>
                          <p className="text-[10px] text-gray-400">
                            {req.projectType} • {req.budget}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Contact Messages Preview */}
              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-white">Incoming Messages</h3>
                  <button
                    onClick={() => setActiveTab("messages")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View All →
                  </button>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    No messages received yet. Inquiries from the Contact section will show here.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.slice(0, 4).map((msg) => (
                      <div
                        key={msg._id}
                        className="p-3 bg-[#181824] rounded-xl border border-gray-800 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-medium text-white">{msg.name}</p>
                          <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                            {msg.subject || msg.message}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            msg.isRead
                              ? "bg-gray-800 text-gray-400"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          {msg.isRead ? "Read" : "New"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECT REQUESTS */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold font-space text-white">Client Project Requests</h2>
                <p className="text-xs text-gray-400">
                  Track quotes, update progress stages, and communicate with clients.
                </p>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-12 text-center text-gray-400">
                <Inbox className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                <h3 className="text-sm font-semibold text-white">No Project Inquiries Yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  When potential clients submit the Project Request / Freelance form on your homepage, their request will show up here with tracking ID and budget.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {requests.map((item) => (
                  <div
                    key={item._id || item.requestId}
                    className="bg-[#12121a] border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-800/80">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
                          #{item.requestId}
                        </span>
                        <h3 className="font-semibold text-sm text-white">{item.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-4">
                      <div>
                        <span className="text-gray-500 block mb-0.5">Email</span>
                        <a
                          href={`mailto:${item.email}`}
                          className="text-indigo-400 hover:underline break-all"
                        >
                          {item.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">Project Type</span>
                        <span className="text-gray-200">{item.projectType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">Budget</span>
                        <span className="text-emerald-400 font-semibold">{item.budget}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">Timeline</span>
                        <span className="text-gray-200">{item.timeline}</span>
                      </div>
                    </div>

                    <div className="bg-[#181824] p-3 rounded-xl text-xs text-gray-300 mb-4 border border-gray-800/80">
                      <span className="text-gray-500 block text-[11px] mb-1 font-semibold uppercase">
                        Client Description:
                      </span>
                      {item.description}
                    </div>

                    {/* Quick Status Update Controls */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800/60">
                      <span className="text-xs text-gray-400 font-medium mr-2">Update Stage:</span>
                      {[
                        "Request Received",
                        "Discussion",
                        "Approved",
                        "Development",
                        "Testing",
                        "Completed"
                      ].map((st) => (
                        <button
                          key={st}
                          disabled={updatingStatus || item.status === st}
                          onClick={() => handleUpdateStatus(item._id, st)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                            item.status === st
                              ? "bg-indigo-600 text-white font-semibold cursor-default"
                              : "bg-[#181824] text-gray-400 hover:text-white hover:bg-gray-800"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTACT MESSAGES */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold font-space text-white">Contact Inquiries</h2>
              <p className="text-xs text-gray-400">
                Direct messages sent from the Contact form on your portfolio.
              </p>
            </div>

            {messages.length === 0 ? (
              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-12 text-center text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                <h3 className="text-sm font-semibold text-white">No Contact Messages Yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Messages submitted through the Get in Touch form on your website will appear right here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`bg-[#12121a] border rounded-2xl p-5 transition-all ${
                      msg.isRead ? "border-gray-800/80" : "border-indigo-500/40 shadow-lg shadow-indigo-950/20"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm text-white">{msg.name}</span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {msg.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        {!msg.isRead && (
                          <button
                            onClick={() => handleMarkMessageRead(msg._id)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition-colors"
                          >
                            Mark Read
                          </button>
                        )}
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                            msg.subject || "Your Portfolio Inquiry"
                          )}`}
                          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg font-medium transition-colors"
                        >
                          Reply
                        </a>
                      </div>
                    </div>

                    {msg.subject && (
                      <p className="text-xs font-medium text-gray-200 mb-2">
                        Subject: <span className="text-indigo-300">{msg.subject}</span>
                      </p>
                    )}

                    <div className="bg-[#181824] p-3 rounded-xl text-xs text-gray-300 leading-relaxed border border-gray-800">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROJECTS */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-space text-white">Portfolio Projects</h2>
                <p className="text-xs text-gray-400">
                  Projects showcased on your homepage.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Technorats Freelance Platform",
                  category: "Full Stack",
                  desc: "Modern agency and developer showcase with custom request tracking.",
                  tags: ["Next.js", "TypeScript", "Node.js", "MongoDB"]
                },
                {
                  title: "AI-Powered SaaS Dashboard",
                  category: "AI & Full Stack",
                  desc: "Smart analytics tool for startup metrics with LLM integrations.",
                  tags: ["React", "FastAPI", "Tailwind CSS", "OpenAI"]
                },
                {
                  title: "E-Commerce Cloud Storefront",
                  category: "Web App",
                  desc: "High-performance storefront with automated checkout & admin view.",
                  tags: ["Next.js", "Stripe", "Prisma", "PostgreSQL"]
                }
              ].map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-[#12121a] border border-gray-800 rounded-2xl p-5 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                      {proj.category}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1 mb-2">{proj.title}</h3>
                    <p className="text-xs text-gray-400 mb-4">{proj.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-800/80">
                    {proj.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#181824] text-gray-300 border border-gray-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DEPLOY & .IN DOMAIN SETUP */}
        {activeTab === "deploy" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold font-space text-white">
                Deployment & .IN Custom Domain Guide
              </h2>
              <p className="text-xs text-gray-400">
                Step-by-step instructions to get your portfolio live on your `.in` domain with working backend & admin authentication.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Step 1: Admin Credentials */}
              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Key className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">
                    1. Admin Credentials (Production Security)
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                  Your admin login is protected via JWT and bcrypt password hashing. Configure these in your backend hosting environment variables:
                </p>
                <div className="bg-[#181824] p-4 rounded-xl font-mono text-xs text-indigo-300 border border-gray-800 space-y-1">
                  <div>ADMIN_EMAIL=your-real-email@gmail.com</div>
                  <div>ADMIN_PASSWORD=your_strong_password_here</div>
                  <div>JWT_SECRET=generate_a_random_32_char_secret_string</div>
                </div>
              </div>

              {/* Step 2: Database Setup (MongoDB Atlas Free) */}
              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">
                    2. Cloud Database (Free MongoDB Atlas)
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                  To save project requests and messages permanently 24/7 without needing local MongoDB:
                </p>
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-2 mb-3">
                  <li>Go to <strong className="text-white">mongodb.com/atlas</strong> and create a free M0 cluster.</li>
                  <li>In Network Access, allow IP Access List: <code className="text-indigo-400 bg-[#181824] px-1 py-0.5 rounded">0.0.0.0/0</code> (Allow access from anywhere).</li>
                  <li>Create a Database User with username and password.</li>
                  <li>Click Connect → Drivers → Copy the connection string:</li>
                </ol>
                <div className="bg-[#181824] p-4 rounded-xl font-mono text-xs text-emerald-300 border border-gray-800">
                  MONGODB_URI=mongodb+srv://abhishek:&lt;password&gt;@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
                </div>
              </div>

              {/* Step 3: Backend Deployment (Render / Railway) */}
              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">
                    3. Backend Deployment (Render or Railway - Free Tier)
                  </h3>
                </div>
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-2">
                  <li>Push your code to GitHub.</li>
                  <li>Go to <strong className="text-white">render.com</strong> → New Web Service → Connect your repository.</li>
                  <li>Set Root Directory to: <code className="text-indigo-400 bg-[#181824] px-1 py-0.5 rounded">backend</code></li>
                  <li>Build Command: <code className="text-indigo-400 bg-[#181824] px-1 py-0.5 rounded">npm install</code></li>
                  <li>Start Command: <code className="text-indigo-400 bg-[#181824] px-1 py-0.5 rounded">node server.js</code></li>
                  <li>Add the Environment Variables (MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, FRONTEND_URL).</li>
                  <li>Copy your deployed backend URL (e.g. <code className="text-indigo-300">https://portfolio-backend.onrender.com</code>).</li>
                </ol>
              </div>

              {/* Step 4: Frontend Deployment on Vercel with .IN Domain */}
              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">
                    4. Frontend Deployment on Vercel + .IN Domain Setup
                  </h3>
                </div>
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-2 mb-4">
                  <li>Go to <strong className="text-white">vercel.com</strong> → Add New Project → Import GitHub repository.</li>
                  <li>Set Root Directory to: <code className="text-indigo-400 bg-[#181824] px-1 py-0.5 rounded">portfolio-app</code></li>
                  <li>In Environment Variables, add:
                    <div className="mt-1 bg-[#181824] p-3 rounded-lg font-mono text-[11px] text-blue-300">
                      NEXT_PUBLIC_API_URL=https://your-deployed-backend-url.onrender.com<br />
                      NEXT_PUBLIC_SITE_URL=https://yourname.in
                    </div>
                  </li>
                  <li>Click <strong className="text-white">Deploy</strong>.</li>
                  <li>Once deployed, go to <strong className="text-white">Project Settings → Domains</strong>:</li>
                  <li>Type your <code className="text-indigo-300">yourname.in</code> and <code className="text-indigo-300">www.yourname.in</code>.</li>
                  <li>In your domain provider (GoDaddy / Hostinger / Namecheap), add the DNS records provided by Vercel:
                    <div className="mt-2 bg-[#181824] p-3 rounded-lg font-mono text-[11px] text-gray-300 space-y-1">
                      <div>Type: <strong>A</strong> | Name: <strong>@</strong> | Value: <strong>76.76.21.21</strong></div>
                      <div>Type: <strong>CNAME</strong> | Name: <strong>www</strong> | Value: <strong>cname.vercel-dns.com</strong></div>
                    </div>
                  </li>
                </ol>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Vercel automatically provisions free SSL/HTTPS certificate for your .in domain!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
