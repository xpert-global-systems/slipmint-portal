import { getBalance } from "../../services/blockchain/wallet";

export default async function handler(req, res) {
  // We use POST so the frontend can securely send the wallet address in the body
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try {
    // Call the blockchain service to get the balance
    const balance = await getBalance(address);

    res.status(200).json({
      success: true,
      address,
      balance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Wallet API Error:", error);
    res.status(500).json({ error: "Failed to fetch wallet data from the blockchain" });
  }
}
