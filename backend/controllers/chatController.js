const { chatWithFinanceAI } = require("../services/ai");
const db = require("../utils/db");

exports.chat = async (req, res) => {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        // Fetch user's transactions and anomalies for context
        db.all("SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT 50", [userId], async (err, transactions) => {
            if (err) {
                console.error("Chat DB error (transactions):", err);
                return res.status(500).json({ error: "Failed to fetch transaction context" });
            }

            db.all("SELECT * FROM anomalies t JOIN transactions tr ON t.transaction_id = tr.id WHERE tr.user_id = ? LIMIT 10", [userId], async (err, anomalies) => {
                const anomalyList = err ? [] : (anomalies || []);

                try {
                    const response = await chatWithFinanceAI(message, transactions || [], anomalyList);
                    res.json({ response });
                } catch (aiError) {
                    console.error("AI Service Error:", aiError);
                    res.status(500).json({ error: "AI service failed to respond" });
                }
            });
        });
    } catch (error) {
        console.error("Chat controller error:", error);
        res.status(500).json({ error: "Server error during chat" });
    }
};