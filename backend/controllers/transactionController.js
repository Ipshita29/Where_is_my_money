const db = require('../utils/db');

exports.listTransactions = (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [userId];

    if (startDate && endDate) {
        query += ' AND date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }

    query += ' ORDER BY date DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Failed to fetch transactions' });
        }
        res.json(rows);
    });
};

exports.getSummary = (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [userId];

    if (startDate && endDate) {
        query += ' AND date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }

    // First fetch transactions to calculate summary
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Failed to fetch summary transactions' });
        }

        const summary = {
            totalSpent: 0,
            totalCredited: 0,
            categoryTotals: {},
            monthlySpending: {},
            dailySpending: {},
            activeFile: null
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

            if (txn.date) {
                // Monthly Spending
                const month = txn.date.substring(0, 7); // YYYY-MM
                summary.monthlySpending[month] = (summary.monthlySpending[month] || 0) + (amount < 0 ? Math.abs(amount) : 0);

                // Daily Spending
                const day = txn.date.substring(0, 10); // YYYY-MM-DD
                summary.dailySpending[day] = (summary.dailySpending[day] || 0) + (amount < 0 ? Math.abs(amount) : 0);
            }
        });

        // Also fetch the user's active file to display in the header
        db.get('SELECT active_file FROM users WHERE id = ?', [userId], (err, userRow) => {
            if (err) console.error("Failed to fetch active file:", err.message);
            if (userRow) summary.activeFile = userRow.active_file;

            res.json(summary);
        });
    });
};

exports.clearTransactions = (req, res) => {
    const userId = req.user.id;

    db.serialize(() => {
        db.run('DELETE FROM dismissed_anomalies WHERE user_id = ?', [userId]);
        db.run('DELETE FROM anomalies WHERE transaction_id IN (SELECT id FROM transactions WHERE user_id = ?)', [userId]);
        db.run('DELETE FROM transactions WHERE user_id = ?', [userId], function (err) {
            if (err) {
                console.error('Database Error:', err);
                return res.status(500).json({ error: 'Failed to clear transactions' });
            }

            db.run('UPDATE users SET active_file = NULL WHERE id = ?', [userId], (updateErr) => {
                if (updateErr) console.error('Error clearing active file:', updateErr);
                res.json({ message: 'All transactions cleared.', deletedCount: this.changes });
            });
        });
    });
};
