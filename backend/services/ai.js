// backend/services/ai.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

/*
=========================================================
AI CHATBOT FOR TRANSACTION INSIGHTS (Gemini Version)
=========================================================
*/

async function chatWithFinanceAI(userMessage, transactions, anomalies) {
  try {
    const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

    const prompt = `
You are a smart personal finance AI assistant.

You are analyzing a user's real banking transactions.

User Question:
"${userMessage}"

Transaction Summary:
Total Transactions: ${transactions.length}
Total Spent: ₹${totalSpent}
Total Anomalies: ${anomalies.length}

Recent Transactions:
${transactions.slice(0, 30).map(t =>
  `Date: ${t.date}, Merchant: ${t.merchant}, Amount: ₹${t.amount}, Category: ${t.category}`
).join("\n")}

Detected Anomalies:
${anomalies.slice(0, 10).map(a =>
  `Merchant: ${a.merchant}, Amount: ₹${a.amount}, Risk Score: ${a.risk_score}`
).join("\n")}

Instructions:
- Give practical financial advice
- Highlight risky behavior
- Suggest 3 improvements
- Keep answer under 250 words
- Use bullet points
- Be friendly but professional
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I couldn't analyze your transactions right now.";
  }
}

module.exports = {
  chatWithFinanceAI
};