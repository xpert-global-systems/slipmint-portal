import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required." });
    }

    // Check API KEY
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ reply: "Server missing GEMINI_API_KEY" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `
You are the SlipMint AI Assistant.

Your role:
- Help users understand trading, crypto markets, and vault performance
- Explain platform features clearly
- Be short, clear, and helpful
- Never mention backend, APIs, or system design
- If asked about risky financial advice, stay neutral and educational
      `,
    });

    const result = await model.generateContent(message);

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      reply: text || "No response generated.",
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    return res.status(500).json({
      reply: error?.message || "AI service error occurred.",
    });
  }
}