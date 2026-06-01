import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: `
        You are the LuckmanWorld AI Assistant.
        Your job is to explain the brand, guide visitors, answer questions,
        and help users understand the services and tools offered.
        Keep responses friendly, helpful, and simple.
        Never mention internal systems or backend architecture.
      `
    });

    const result = await model.generateContent(message);
    res.status(200).json({ reply: result.text() });

  } catch (error) {
    res.status(500).json({ reply: "Something went wrong." });
  }
}
