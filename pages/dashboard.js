"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../services/auth";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    getUser(token)
      .then((data) => {
        if (!data || !data.success) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setUser(data.user);
          setLoading(false);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#081120] text-white">
        <h2 className="text-xl font-semibold animate-pulse">
          Loading your dashboard…
        </h2>
      </div>
    );
  }

  const baseBalance = user?.balance || 0;
  const totalInvested = user?.totalInvested || 1;

  const performanceData = [
    { week: "Week 1", profit: 250, loss: 50 },
    { week: "Week 2", profit: 480, loss: 120 },
    { week: "Week 3", profit: 320, loss: 80 },
    { week: "Week 4", profit: 650, loss: 150 },
  ];

  const balanceHistory = [
    { day: "Mon", balance: baseBalance },
    { day: "Tue", balance: baseBalance + 50 },
    { day: "Wed", balance: baseBalance + 120 },
    { day: "Thu", balance: baseBalance + 180 },
    { day: "Fri", balance: baseBalance + 250 },
  ];

  const totalProfit = performanceData.reduce((sum, item) => sum + item.profit, 0);
  const totalLoss = performanceData.reduce((sum, item) => sum + item.loss, 0);
  const roi = ((totalProfit - totalLoss) / totalInvested) * 100;

  return (
    <div className="min-h-screen w-full bg-[#081120] text-white font-sans pb-12">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f1b2d] sticky top-0 z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-wider text-emerald-400">
            SlipMint
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 border border-red-500/20 transition-all hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome */}
        <div className="flex items-center justify-between rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
          <div>
            <p className="text-sm font-medium text-[#b8c7d9]">Welcome back!</p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              {user?.displayName || user?.fullName || "User"}
            </h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-2xl border border-white/10">
            👤
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <p className="text-sm text-[#b8c7d9]">Current Balance</p>
            <h2 className="mt-2 text-3xl font-bold">
              ${baseBalance.toLocaleString()}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Initial: ${(user?.totalInvested || 0).toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <p className="text-sm text-[#b8c7d9]">ROI</p>
            <h2
              className={`mt-2 text-3xl font-bold ${
                roi >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {roi.toFixed(2)}%
            </h2>
            <p className="mt-1 text-xs text-slate-400">Return on investment</p>
          </div>

          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <p className="text-sm text-[#b8c7d9]">Total Profit</p>
            <h2 className="mt-2 text-3xl font-bold text-emerald-400">
              +${totalProfit.toLocaleString()}
            </h2>
            <p className="mt-1 text-xs text-slate-400">This period</p>
          </div>

          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <p className="text-sm text-[#b8c7d9]">Total Loss</p>
            <h2 className="mt-2 text-3xl font-bold text-red-400">
              -${totalLoss.toLocaleString()}
            </h2>
            <p className="mt-1 text-xs text-slate-400">This period</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <h3 className="text-lg font-semibold mb-4">Balance History</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="day" stroke="#b8c7d9" />
                  <YAxis stroke="#b8c7d9" />
                  <Tooltip
                    contentStyle={{
                      background: "#081120",
                      border: "none",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="week" stroke="#b8c7d9" />
                  <YAxis stroke="#b8c7d9" />
                  <Tooltip
                    contentStyle={{
                      background: "#081120",
                      border: "none",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="loss" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5 space-y-4">
            <h3 className="text-lg font-semibold border-b border-white/10 pb-2">
              Account Information
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-[#b8c7d9]">Email:</span>
              <span className="text-white">{user?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#b8c7d9]">Occupation:</span>
              <span className="text-white">{user?.occupation || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#b8c7d9]">Phone:</span>
              <span className="text-white">{user?.phone || "N/A"}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5 space-y-4">
            <h3 className="text-lg font-semibold border-b border-white/10 pb-2">
              Wallet Info
            </h3>

            {user?.walletAddress ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-[#b8c7d9]">Status:</span>
                  <span className="text-emerald-400 font-medium">
                    ✓ Connected
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#b8c7d9]">Address:</span>
                  <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-xs text-slate-300">
                    {user.walletAddress.slice(0, 6)}...
                    {user.walletAddress.slice(-4)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 text-center">
                <span className="text-sm text-amber-400 font-medium mb-3">
                  ⚠ No Wallet Connected
                </span>
                <button className="text-xs bg-emerald-500 hover:bg-emerald-600 font-bold py-2 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/10">
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
