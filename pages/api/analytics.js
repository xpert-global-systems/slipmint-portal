import { getProvider } from "../../services/blockchain/provider";
import { ethers } from "ethers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const provider = getProvider();

    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const feeData = await provider.getFeeData();

    const analyticsData = {
      status: "Live",
      networkName: network.name,
      chainId: network.chainId.toString(),
      currentBlock: blockNumber,
      gasPriceWei: feeData.gasPrice ? feeData.gasPrice.toString() : "Unknown",
      gasPriceGwei: feeData.gasPrice
        ? ethers.formatUnits(feeData.gasPrice, "gwei")
        : "Unknown",
      timestamp: new Date().toISOString()
    };

    res.status(200).json(analyticsData);

  } catch (error) {
    console.error("Analytics API Error:", error);
    res.status(500).json({ error: "Failed to fetch live analytics data" });
  }
}
