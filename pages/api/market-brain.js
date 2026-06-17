import { GoogleGenerativeAI } from "@google/generative-ai"
import { ethers } from "ethers"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { prompt } = req.body

    // -----------------------------
    // 1. INIT GEMINI AI (Brain)
    // -----------------------------
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // -----------------------------
    // 2. FOREX NEWS DATA
    // -----------------------------
    let newsData = []

    try {
      const newsRes = await fetch(
        `https://newsapi.org/v2/everything?q=forex OR xauusd OR eurusd&apiKey=${process.env.NEWS_API_KEY}`
      )
      const newsJson = await newsRes.json()
      newsData = newsJson.articles?.slice(0, 5) || []
    } catch (err) {
      console.log("News API failed", err)
    }

    // -----------------------------
    // 3. INFURA CRYPTO DATA
    // -----------------------------
    let walletData = null

    try {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`
      )

      const blockNumber = await provider.getBlockNumber()

      walletData = {
        network: "mainnet",
        latestBlock: blockNumber,
      }
    } catch (err) {
      console.log("Infura failed", err)
    }

    // -----------------------------
    // 4. BUILD MARKET CONTEXT
    // -----------------------------
    const context = `
You are SlipMint Market Brain AI.

Use the following data:

NEWS:
${JSON.stringify(newsData, null, 2)}

CRYPTO:
${JSON.stringify(walletData, null, 2)}

USER REQUEST:
${prompt}

Return:
- Market insight
- Trade bias (BUY/SELL/WAIT)
- Risk note
- Explanation in simple trader language
`

    // -----------------------------
    // 5. GENERATE AI RESPONSE
    // -----------------------------
    const result = await model.generateContent(context)
    const response = await result.response.text()

    return res.status(200).json({
      success: true,
      response,
      news: newsData,
      crypto: walletData,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
