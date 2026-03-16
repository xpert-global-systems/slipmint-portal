 import { ethers } from "ethers";

// Cache provider so we reuse a single connection
let provider = null;

export function getProvider() {
  try {
    if (!provider) {
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

      // If no RPC provided, fallback to public Ethereum node
      const finalRpc = rpcUrl || "https://cloudflare-eth.com";

      if (!rpcUrl) {
        console.warn("⚠️ NEXT_PUBLIC_RPC_URL not found. Using fallback RPC.");
      }

      provider = new ethers.JsonRpcProvider(finalRpc, {
        name: "ethereum",
        chainId: 1
      });
    }

    return provider;

  } catch (error) {
    console.error("Blockchain provider initialization failed:", error);
    throw new Error("Unable to initialize blockchain provider");
  }
}
