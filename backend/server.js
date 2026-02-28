require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

require('./utils/db');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/anomalies', require('./routes/anomalies'));

// AI Analysis Endpoint (Incorporated from remote change)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/analyze", async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!transactions) return res.status(400).json({ error: "No transactions provided" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are a smart financial advisor.

    Analyze these transactions:
    ${JSON.stringify(transactions, null, 2)}

    Provide:
    - Spending insights
    - Bad habits
    - Savings recommendations
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ analysis: response.text() });

  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

app.get('/', (req, res) => {
  res.send('SERVER WORKING');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
