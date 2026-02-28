const db = require('../utils/db');

exports.listTransactions = (req, res) => {
    const userId = req.user.id;

    db.all('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC', [userId], (err, rows) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Failed to fetch transactions' });
        }
        res.json(rows);
    });
};

exports.getSummary = (req, res) => {
    const userId = req.user.id;

    db.all('SELECT * FROM transactions WHERE user_id = ?', [userId], (err, rows) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Failed to fetch summary' });
        }

        const summary = {
            totalSpent: 0,
            totalCredited: 0,
            categoryTotals: {},
            monthlySpending: {}
        };

        rows.forEach(txn => {
            const amount = txn.amount;
            if (amount < 0) {
                summary.totalSpent += Math.abs(amount);
            } else {
                summary.totalCredited += amount;
            }

            // Category Totals (only for spending)
            if (amount < 0) {
                const cat = txn.category || 'Uncategorized';
                summary.categoryTotals[cat] = (summary.categoryTotals[cat] || 0) + Math.abs(amount);
            }

            // Monthly Spending
            if (txn.date) {
                const month = txn.date.substring(0, 7); // YYYY-MM
                summary.monthlySpending[month] = (summary.monthlySpending[month] || 0) + (amount < 0 ? Math.abs(amount) : 0);
            }
        });

        res.json(summary);
    });
};
