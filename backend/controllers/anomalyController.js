const db = require('../utils/db');

exports.listAnomalies = (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT a.*, t.merchant, t.amount, t.date, t.category 
        FROM anomalies a
        JOIN transactions t ON a.transaction_id = t.id
        WHERE t.user_id = ?
        ORDER BY a.created_at DESC
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Failed to fetch anomalies' });
        }
        res.json(rows);
    });
};
