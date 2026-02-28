const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const authMiddleware = require('../utils/authMiddleware');

// Detect anomalies from the user's transactions:
//   1. Duplicate charges – same merchant + same amount within 7 days
//   2. Unusually large transactions – amount > 3× the user's average spending
router.get('/', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let query = `
         SELECT t.* FROM transactions t
         LEFT JOIN dismissed_anomalies d 
           ON t.id = d.transaction_id AND d.user_id = ?
         WHERE t.user_id = ? AND t.amount < 0 AND d.transaction_id IS NULL 
    `;
    const params = [userId, userId];

    if (startDate && endDate) {
        query += ' AND t.date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }
    query += ' ORDER BY t.date DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Anomalies DB error:', err);
            return res.status(500).json({ error: 'Failed to fetch anomalies' });
        }

        if (rows.length === 0) {
            return res.json([]);
        }

        const anomalies = [];
        const seen = new Map(); // key: "merchant|amount" -> date

        // Calculate average absolute spending amount
        const total = rows.reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const avg = total / rows.length;

        rows.forEach((txn) => {
            const amt = Math.abs(txn.amount);

            // 1. Duplicate detection – same merchant + same amount within 7 days
            const key = `${(txn.merchant || '').toLowerCase()}|${amt}`;
            if (seen.has(key)) {
                const prevDate = new Date(seen.get(key));
                const curDate = new Date(txn.date);
                const diffDays = Math.abs((prevDate - curDate) / (1000 * 60 * 60 * 24));
                if (diffDays <= 7) {
                    anomalies.push({
                        id: txn.id,
                        merchant: txn.merchant || 'Unknown',
                        amount: amt.toFixed(2),
                        date: txn.date,
                        category: txn.category || 'Uncategorized',
                        risk: 'High',
                        color: 'red',
                        details: `Possible duplicate charge detected within 7 days.`,
                    });
                }
            } else {
                seen.set(key, txn.date);
            }

            // 2. Unusually large – more than 3× average
            if (amt > avg * 3 && avg > 0) {
                anomalies.push({
                    id: txn.id,
                    merchant: txn.merchant || 'Unknown',
                    amount: amt.toFixed(2),
                    date: txn.date,
                    category: txn.category || 'Uncategorized',
                    risk: amt > avg * 6 ? 'High' : 'Medium',
                    color: amt > avg * 6 ? 'red' : 'orange',
                    details: `Unusually large charge — ${(amt / avg).toFixed(1)}× your average spend.`,
                });
            }
        });

        // Deduplicate by id (a txn might trigger both rules)
        const unique = [...new Map(anomalies.map((a) => [a.id, a])).values()];
        res.json(unique);
    }
    );
});

// Dismiss an anomaly so it won't show up again
router.post('/:id/dismiss', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const transactionId = req.params.id;

    db.run(
        'INSERT OR IGNORE INTO dismissed_anomalies (user_id, transaction_id) VALUES (?, ?)',
        [userId, transactionId],
        function (err) {
            if (err) {
                console.error('Failed to dismiss anomaly:', err);
                return res.status(500).json({ error: 'Failed to dismiss anomaly' });
            }
            res.json({ success: true, message: 'Anomaly dismissed' });
        }
    );
});

// Ask AI to explain an anomaly
const { explainAnomaly } = require('../services/ai');

router.post('/explain', authMiddleware, async (req, res) => {
    const { merchant, amount, category, date } = req.body;

    if (!merchant || !amount) {
        return res.status(400).json({ error: 'Missing transaction details' });
    }

    try {
        const explanation = await explainAnomaly(merchant, amount, category || 'Unknown', date || 'Unknown');
        res.json({ explanation });
    } catch (error) {
        console.error('Explain anomaly route error:', error);
        res.status(500).json({ error: 'Failed to generate explanation' });
    }
});

module.exports = router;