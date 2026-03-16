import { getProvider } from "../../services/blockchain/provider";
import { ethers } from "ethers";

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const provider = getProvider();

    // Ensure provider exists
    if (!provider) {
      throw new Error("Blockchain provider not initialized");
    }

    // Fetch blockchain data
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const feeData = await provider.getFeeData();

    const gasPriceWei = feeData?.gasPrice ? feeData.gasPrice.toString() : null;

    const analyticsData = {
      status: "Live",
      networkName: network?.name || "unknown",
      chainId: network?.chainId ? Number(network.chainId) : null,
      currentBlock: blockNumber,
      gasPriceWei: gasPriceWei,
      gasPriceGwei: gasPriceWei
        ? ethers.formatUnits(gasPriceWei, "gwei")
        : null,
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(analyticsData);

  } catch (error) {

    console.error("Analytics API Error:", error);

    return res.status(500).json({
      error: "Failed to fetch live analytics data",
      details: error.message
    });
  }
}
