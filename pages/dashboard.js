"use client";
import TradeHistory from "../components/TradeHistory";
import BarChart from "../components/BarChart";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../services/auth";
import axios from "axios";

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

  // User + loading
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI Chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // Crypto News
  const [news, setNews] = useState([]);

  // Crypto Price Charts
  const [btcData, setBtcData] = useState([]);
  const [ethData, setEthData] = useState([]);

  // Fetch crypto prices
  const fetchCryptoPrices = async () => {
    try {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            ids: "bitcoin,ethereum",
          },
        }
      );

      const btc = res.data.find((c) => c.id === "bitcoin");
      const eth = res.data.find((c) => c.id === "ethereum");

      setBtcData((prev) => [
        ...prev.slice(-20),
        { time: new Date().toLocaleTimeString(), price: btc.current_price },
      ]);

      setEthData((prev) => [
        ...prev.slice(-20),
        { time: new Date().toLocaleTimeString(), price: eth.current_price },
      ]);
    } catch (err) {
      console.error("Crypto price fetch failed");
    }
  };

  // AI Chat send
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoadingAI(true);

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage.text }),
    });

    const data = await res.json();
    const botMessage = { role: "bot", text: data.reply };

    setMessages((prev) => [...prev, botMessage]);
    setLoadingAI(false);
  };

  // Load user + news + crypto prices
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

    // Fetch news
    axios.get("/api/news").then((res) => {
      setNews(res.data.data || []);
    });

    // Fetch crypto prices + auto refresh
    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 60000);
    return () => clearInterval(interval);
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

  // Dashboard metrics
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
    <h2 className={`mt-2 text-3xl font-bold ${roi >= 0 ? "text-emerald-400" : "text-red-400"}`}>
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

</div>   {/* ✅ END OF METRICS GRID */}

{/* Bar Chart */}
<div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5 mt-6">
  <h3 className="text-lg font-bold mb-4">Portfolio Performance</h3>
  <BarChart />
</div>

{/* Trade History */}
<div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5 mt-6">
  <h3 className="text-lg font-bold mb-4">Recent Trades</h3>
  <TradeHistory />
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
          {/* Balance History */}
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

          {/* Weekly Performance */}
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

        {/* Crypto Price Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Bitcoin */}
          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <h3 className="text-lg font-semibold mb-4">Bitcoin (BTC) Price</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={btcData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#b8c7d9" />
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
                    dataKey="price"
                    stroke="#f7931a"
                    strokeWidth={2.5}
                    dot={{ fill: "#f7931a" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ethereum */}
          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <h3 className="text-lg font-semibold mb-4">Ethereum (ETH) Price</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ethData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#b8c7d9" />
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
                    dataKey="price"
                    stroke="#627eea"
                    strokeWidth={2.5}
                    dot={{ fill: "#627eea" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Crypto News */}
        <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
          <h3 className="text-lg font-semibold mb-4">Crypto News</h3>

          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {news.map((item, i) => (
              <div key={i} className="p-4 bg-[#081120] rounded-xl border border-white/10">
                <h4 className="font-semibold text-emerald-400">{item.title}</h4>
                <p className="text-sm text-slate-300 mt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Chat */}
        <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
          <h3 className="text-lg font-semibold mb-4">AI Assistant</h3>

          <div className="h-[250px] overflow-y-auto p-3 bg-[#081120] rounded-xl border border-white/10 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {loadingAI && (
              <p className="text-slate-400 text-sm animate-pulse">Thinking…</p>
            )}
          </div>

          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI assistant…"
              className="flex-1 px-4 py-2 rounded-xl bg-[#081120] border border-white/10 text-white"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold"
            >
              Send
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
