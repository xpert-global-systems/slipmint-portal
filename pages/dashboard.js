"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import TradeHistory from "../components/TradeHistory";
import BarChart from "../components/BarChart";
import { getUser } from "../services/auth";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// ============================================
// CONFIGURATION - Update these for your deployment
// ============================================
const CONFIG = {
  // Base Network (L2)
  BASE_RPC: process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org",

  // Contract Addresses (replace with your actual deployed addresses)
  FOUNDER_VAULT: process.env.NEXT_PUBLIC_VAULT_ADDRESS || "0x0000000000000000000000000000000000000000",
  XPERT_TOKEN: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",

  // API Endpoints
  SLIPMINT_AI_API: process.env.NEXT_PUBLIC_AI_API || "/api/ai",
  SLIPMINT_CORE_API: process.env.NEXT_PUBLIC_CORE_API || "/api/core",

  // Subscription Tiers
  TIERS: {
    FREE: "free",
    FOUNDER: "founder",
  },
};

// ============================================
// ABI FRAGMENTS (minimal for read operations)
// ============================================
const VAULT_ABI = [
  "function shares(address) view returns (uint256)",
  "function totalAssets() view returns (uint256)",
  "function performanceFee() view returns (uint256)",
  "function managementFee() view returns (uint256)",
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 shares) external",
  "event Deposit(address indexed user, uint256 amount, uint256 sharesIssued)",
  "event Withdrawal(address indexed user, uint256 sharesRedeemed, uint256 amountReceived)",
];

const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

// ============================================
// HELPER: Format USDC (6 decimals)
// ============================================
const formatUSDC = (value) => {
  if (!value) return "0.00";
  return (Number(value) / 1e6).toFixed(2);
};

const formatToken = (value, decimals = 18) => {
  if (!value) return "0.00";
  return (Number(value) / 10 ** decimals).toFixed(4);
};

// ============================================
// COMPONENT: Feature Gate
// ============================================
function FeatureGate({ tier, requiredTier, children, fallback }) {
  const tiers = { free: 0, founder: 1 };
  const hasAccess = tiers[tier] >= tiers[requiredTier];

  if (hasAccess) return children;
  return fallback || (
    <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5 opacity-60">
      <div className="text-center py-8">
        <p className="text-lg font-semibold text-white mb-2">ð Founder Vault Exclusive</p>
        <p className="text-sm text-[#b8c7d9] mb-4">Upgrade to access advanced analytics and governance features.</p>
        <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold text-sm transition-all">
          Upgrade to Founder
        </button>
      </div>
    </div>
  );
}

// ============================================
// COMPONENT: Wallet Connection
// ============================================
function WalletConnect({ onConnect, connected, address }) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    setConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask or Coinbase Wallet not found. Please install a wallet extension.");
      }

      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });

      // Switch to Base network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }], // Base mainnet
        });
      } catch (switchError) {
        // If Base not added, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0x2105",
              chainName: "Base",
              nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://mainnet.base.org"],
              blockExplorerUrls: ["https://basescan.org"],
            }],
          });
        }
      }

      onConnect(accounts[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    onConnect(null);
  };

  if (connected && address) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
          â Base
        </span>
        <span className="text-sm text-[#b8c7d9] font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button 
          onClick={disconnectWallet}
          className="text-xs text-red-400 hover:text-red-300 underline"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={connectWallet}
        disabled={connecting}
        className="rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400 border border-emerald-500/20 transition-all hover:bg-emerald-500 hover:text-white disabled:opacity-50"
      >
        {connecting ? "Connecting..." : "Connect Wallet"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ============================================
// COMPONENT: Vault Position Card
// ============================================
function VaultPosition({ address, vaultContract }) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address || !vaultContract) return;

    const fetchPosition = async () => {
      try {
        setLoading(true);
        // In production, use ethers.js or viem to call contract
        // For now, simulate with realistic data structure
        // Replace with actual contract calls:
        // const shares = await vaultContract.shares(address);
        // const totalAssets = await vaultContract.totalAssets();

        // MOCK DATA - Replace with actual on-chain calls
        const mockPosition = {
          shares: "150000000000000000000", // 150 shares (18 decimals)
          totalUserAssets: "2500000000", // $2,500 USDC (6 decimals)
          initialDeposit: "2000000000", // $2,000 USDC
          profit: "500000000", // $500 profit
          performanceFeePaid: "100000000", // $100 fee paid
          entryNav: "13.33", // NAV at entry
          currentNav: "16.67", // Current NAV
          pendingWithdrawal: false,
        };

        setPosition(mockPosition);
      } catch (err) {
        setError("Failed to fetch vault position");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosition();
  }, [address, vaultContract]);

  if (loading) return (
    <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-white/10 rounded w-1/3"></div>
        <div className="h-8 bg-white/10 rounded w-2/3"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-red-500/20">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  if (!position) return (
    <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
      <p className="text-[#b8c7d9] text-sm">No active vault position</p>
      <button className="mt-3 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-sm font-semibold transition-all">
        Deposit to Founder Vault
      </button>
    </div>
  );

  const roi = ((Number(position.currentNav) - Number(position.entryNav)) / Number(position.entryNav)) * 100;

  return (
    <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Founder Vault Position</h3>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-[#b8c7d9]">Current Value</p>
          <p className="text-2xl font-bold text-white">${formatUSDC(position.totalUserAssets)}</p>
        </div>
        <div>
          <p className="text-xs text-[#b8c7d9]">ROI</p>
          <p className={`text-2xl font-bold ${roi >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {roi >= 0 ? "+" : ""}{roi.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-[#b8c7d9]">Shares Owned</p>
          <p className="text-lg font-semibold text-white">{formatToken(position.shares)}</p>
        </div>
        <div>
          <p className="text-xs text-[#b8c7d9]">NAV</p>
          <p className="text-lg font-semibold text-white">${Number(position.currentNav).toFixed(2)}</p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between text-xs text-[#b8c7d9] mb-1">
          <span>Initial Deposit</span>
          <span>${formatUSDC(position.initialDeposit)}</span>
        </div>
        <div className="flex justify-between text-xs text-emerald-400 mb-1">
          <span>Gross Profit</span>
          <span>+${formatUSDC(position.profit)}</span>
        </div>
        <div className="flex justify-between text-xs text-red-400">
          <span>Performance Fees (20%)</span>
          <span>-${formatUSDC(position.performanceFeePaid)}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-sm font-semibold transition-all">
          Deposit More
        </button>
        <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-all">
          Withdraw
        </button>
      </div>
    </div>
  );
}

// ============================================
// COMPONENT: XPERT Token Balance
// ============================================
function TokenBalance({ address, tokenContract }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    // In production: const bal = await tokenContract.balanceOf(address);
    // MOCK for now:
    setTimeout(() => {
      setBalance("5000000000000000000000"); // 5,000 XPERT
      setLoading(false);
    }, 500);
  }, [address]);

  if (loading) return (
    <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
      <div className="h-8 bg-white/10 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
      <p className="text-sm text-[#b8c7d9]">XPERT Token Balance</p>
      <h2 className="mt-2 text-3xl font-bold text-white">
        {formatToken(balance)} <span className="text-lg text-emerald-400">XPERT</span>
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Governance voting power + staking rewards
      </p>
    </div>
  );
}

// ============================================
// MAIN DASHBOARD
// ============================================
export default function Dashboard() {
  const router = useRouter();

  // User + loading
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Wallet
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  // AI Chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Crypto News
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  // Crypto Price Charts
  const [btcData, setBtcData] = useState([]);
  const [ethData, setEthData] = useState([]);
  const [cryptoError, setCryptoError] = useState(null);

  // Subscription tier
  const [tier, setTier] = useState("free");

  // Fetch crypto prices
  const fetchCryptoPrices = useCallback(async () => {
    try {
      setCryptoError(null);
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            ids: "bitcoin,ethereum",
          },
          timeout: 10000,
        }
      );

      const btc = res.data.find((c) => c.id === "bitcoin");
      const eth = res.data.find((c) => c.id === "ethereum");

      if (!btc || !eth) throw new Error("Missing crypto data");

      const now = new Date().toLocaleTimeString();

      setBtcData((prev) => [...prev.slice(-19), { time: now, price: btc.current_price }]);
      setEthData((prev) => [...prev.slice(-19), { time: now, price: eth.current_price }]);
    } catch (err) {
      console.error("Crypto price fetch failed:", err.message);
      setCryptoError("Failed to fetch prices");
    }
  }, []);

  // AI Chat send
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoadingAI(true);
    setAiError(null);

    try {
      const res = await fetch(CONFIG.SLIPMINT_AI_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage.text,
          wallet: walletAddress,
          tier: tier,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const botMessage = { role: "bot", text: data.reply || "No response from AI" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("AI chat error:", err);
      setAiError("AI service temporarily unavailable");
      setMessages((prev) => [...prev, { 
        role: "bot", 
        text: "AI analysis engine is updating. Please try again shortly.", 
        isError: true 
      }]);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle wallet connection
  const handleWalletConnect = (address) => {
    setWalletAddress(address);
    setWalletConnected(!!address);

    if (address) {
      // Check if this wallet has Founder Vault shares â upgrade tier
      // In production: query contract or backend
      localStorage.setItem("connectedWallet", address);
    } else {
      localStorage.removeItem("connectedWallet");
    }
  };

  // Load user + news + crypto + wallet
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedWallet = localStorage.getItem("connectedWallet");

    if (savedWallet) {
      setWalletAddress(savedWallet);
      setWalletConnected(true);
    }

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
          setTier(data.user.subscription?.tier || "free");
          setLoading(false);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });

    // Fetch news
    setNewsLoading(true);
    axios.get("/api/news", { timeout: 10000 })
      .then((res) => setNews(res.data.data || []))
      .catch(() => setNews([]))
      .finally(() => setNewsLoading(false));

    // Fetch crypto prices
    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 60000);
    return () => clearInterval(interval);
  }, [router, fetchCryptoPrices]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("connectedWallet");
    setWalletAddress(null);
    setWalletConnected(false);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#081120] text-white">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent mx-auto"></div>
          <h2 className="text-xl font-semibold animate-pulse">Loading SlipMint...</h2>
        </div>
      </div>
    );
  }

  // Real vault performance data (would come from on-chain events in production)
  const vaultHistory = [
    { day: "Mon", nav: 13.33, aum: 100000 },
    { day: "Tue", nav: 14.10, aum: 105000 },
    { day: "Wed", nav: 14.85, aum: 110000 },
    { day: "Thu", nav: 15.20, aum: 112500 },
    { day: "Fri", nav: 16.67, aum: 125000 },
  ];

  return (
    <div className="min-h-screen w-full bg-[#081120] text-white font-sans pb-12">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f1b2d] sticky top-0 z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-wider text-emerald-400">SlipMint</h1>
            <span className="hidden sm:inline text-xs bg-white/5 px-2 py-1 rounded-full text-[#b8c7d9]">
              {tier === "founder" ? "ð Founder Vault" : "Free Tier"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <WalletConnect 
              onConnect={handleWalletConnect} 
              connected={walletConnected} 
              address={walletAddress} 
            />
            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 border border-red-500/20 transition-all hover:bg-red-500 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

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
            ð¤
          </div>
        </div>

        {/* On-Chain Position + Token Balance */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <VaultPosition address={walletAddress} vaultContract={null} />
          <TokenBalance address={walletAddress} tokenContract={null} />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <p className="text-sm text-[#b8c7d9]">Vault TVL</p>
            <h2 className="mt-2 text-3xl font-bold text-white">$125,000</h2>
            <p className="mt-1 text-xs text-emerald-400">+25% this month</p>
          </div>
          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <p className="text-sm text-[#b8c7d9]">Performance Fee</p>
            <h2 className="mt-2 text-3xl font-bold text-white">20%</h2>
            <p className="mt-1 text-xs text-slate-400">Of profits only</p>
          </div>
          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <p className="text-sm text-[#b8c7d9]">Management Fee</p>
            <h2 className="mt-2 text-3xl font-bold text-white">2%</h2>
            <p className="mt-1 text-xs text-slate-400">Annual</p>
          </div>
          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <p className="text-sm text-[#b8c7d9]">Active Depositors</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-400">47</h2>
            <p className="mt-1 text-xs text-slate-400">Growing community</p>
          </div>
        </div>

        {/* Vault NAV History + Portfolio Performance */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FeatureGate tier={tier} requiredTier="founder">
            <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
              <h3 className="text-lg font-semibold mb-4">Vault NAV History</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vaultHistory}>
                    <defs>
                      <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="day" stroke="#b8c7d9" />
                    <YAxis stroke="#b8c7d9" domain={["auto", "auto"]} />
                    <Tooltip
                      contentStyle={{
                        background: "#081120",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        color: "#fff",
                      }}
                      formatter={(value) => [`$${value}`, "NAV"]}
                    />
                    <Area type="monotone" dataKey="nav" stroke="#10b981" fill="url(#navGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FeatureGate>

          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
            <BarChart />
          </div>
        </div>

        {/* AUM Growth + Trade History */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FeatureGate tier={tier} requiredTier="founder">
            <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
              <h3 className="text-lg font-semibold mb-4">AUM Growth</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vaultHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="day" stroke="#b8c7d9" />
                    <YAxis stroke="#b8c7d9" />
                    <Tooltip
                      contentStyle={{
                        background: "#081120",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        color: "#fff",
                      }}
                      formatter={(value) => [`$${value.toLocaleString()}`, "AUM"]}
                    />
                    <Line type="monotone" dataKey="aum" stroke="#627eea" strokeWidth={2.5} dot={{ fill: "#627eea" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FeatureGate>

          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
            <TradeHistory />
          </div>
        </div>

        {/* Crypto Price Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Bitcoin (BTC) Price</h3>
              {cryptoError && <span className="text-xs text-red-400">{cryptoError}</span>}
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={btcData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#b8c7d9" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#b8c7d9" domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#081120",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, "BTC"]}
                  />
                  <Line type="monotone" dataKey="price" stroke="#f7931a" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Ethereum (ETH) Price</h3>
              {cryptoError && <span className="text-xs text-red-400">{cryptoError}</span>}
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ethData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#b8c7d9" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#b8c7d9" domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#081120",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, "ETH"]}
                  />
                  <Line type="monotone" dataKey="price" stroke="#627eea" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Crypto News */}
        <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
          <h3 className="text-lg font-semibold mb-4">Crypto News</h3>
          {newsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
            </div>
          ) : news.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No news available</p>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {news.map((item, i) => (
                <div key={item.id || i} className="p-4 bg-[#081120] rounded-xl border border-white/10">
                  <h4 className="font-semibold text-emerald-400">{item.title}</h4>
                  <p className="text-sm text-slate-300 mt-1">{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Assistant - Founder Vault Exclusive */}
        <FeatureGate tier={tier} requiredTier="founder">
          <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AI Intelligence Engine</h3>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
                Founder Vault
              </span>
            </div>

            <div className="h-[250px] overflow-y-auto p-3 bg-[#081120] rounded-xl border border-white/10 mb-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-8">
                  Ask about market conditions, vault performance, or risk metrics...
                </p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <span className={`inline-block px-3 py-2 rounded-xl text-sm max-w-[80%] break-words ${
                    msg.role === "user" ? "bg-emerald-500 text-white" : msg.isError ? "bg-red-500/20 text-red-300" : "bg-white/10 text-white"
                  }`}>
                    {msg.text}
                  </span>
                </div>
              ))}
              {loadingAI && (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
                  <span>Analyzing market data...</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the AI engine..."
                className="flex-1 px-4 py-2 rounded-xl bg-[#081120] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                disabled={loadingAI}
              />
              <button
                onClick={sendMessage}
                disabled={loadingAI || !input.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-xl font-semibold transition-all"
              >
                Send
              </button>
            </div>
            {aiError && <p className="mt-2 text-xs text-red-400">{aiError}</p>}
          </div>
        </FeatureGate>

      </main>
    </div>
  );
}
