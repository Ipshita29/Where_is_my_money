import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/analyze", async (req, res) => {
  try {
    const { transactions } = req.body;

    const prompt = `
    You are a smart financial advisor.

    Analyze these transactions:
    ${JSON.stringify(transactions, null, 2)}

    Provide:
    - Spending insights
    - Bad habits
    - Savings recommendations
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

