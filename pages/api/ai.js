import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../../services/firebase"; // <- new

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: `
You are SlipMint AI Assistant.

You help users with:
- trading insights
- crypto explanations
- platform guidance
- vault analytics

Rules:
- Keep responses short and clear
- Do NOT mention backend or APIs
- Be professional but friendly
      `,
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    // Save chat memory to Firestore
    await db.collection("chatHistory").add({
      userId: userId || "anonymous",
      message,
      reply,
      timestamp: new Date(),
    });

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({
      reply: "AI service temporarily unavailable. Please try again.",
    });
  }
}