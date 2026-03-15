import { ethers } from "ethers";

// Cache the provider instance
let provider = null;

// Create or retrieve the provider using an RPC endpoint
export function getProvider() {
  if (!provider) {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    
    if (!rpcUrl) {
      console.error("Missing NEXT_PUBLIC_RPC_URL environment variable");
    }
    
    // Fallback to a public provider if the env variable is missing during setup
    provider = new ethers.JsonRpcProvider(rpcUrl || "https://cloudflare-eth.com"); 
  }
  return provider;
}

// Get wallet balance in Ether
export async function getBalance(address) {
  try {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
}

// Get latest block number
export async function getBlockNumber() {
  try {
    const provider = getProvider();
    return await provider.getBlockNumber();
  } catch (error) {
    console.error("Error fetching block number:", error);
    throw error;
  }
}

// Get transaction details
export async function getTransaction(txHash) {
  try {
    const provider = getProvider();
    return await provider.getTransaction(txHash);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
}
