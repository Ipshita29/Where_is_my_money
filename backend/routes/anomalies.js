const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const authMiddleware = require('../utils/authMiddleware');

// Detect anomalies from the user's transactions:
//   1. Duplicate charges – same merchant + same amount within 7 days
//   2. Unusually large transactions – amount > 3× the user's average spending
router.get('/', authMiddleware, (req, res) => {
    const userId = req.user.id;

    db.all(
        'SELECT * FROM transactions WHERE user_id = ? AND amount < 0 ORDER BY date DESC',
        [userId],
        (err, rows) => {
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

module.exports = router;