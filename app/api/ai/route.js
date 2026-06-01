import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { message } = await req.json();

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
    return Response.json({ reply: result.text() });

  } catch (error) {
    return Response.json({ reply: "Something went wrong." });
  }
}
