import { ethers } from "ethers";

// Cache the provider instance so we don't open too many connections
let provider = null;

export function getProvider() {
  if (!provider) {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    
    if (!rpcUrl) {
      console.warn("Warning: NEXT_PUBLIC_RPC_URL is missing. Using public fallback.");
    }
    
    // Connect to the provided RPC or fallback to a public Ethereum node
    provider = new ethers.JsonRpcProvider(rpcUrl || "https://cloudflare-eth.com"); 
  }
  return provider;
}
