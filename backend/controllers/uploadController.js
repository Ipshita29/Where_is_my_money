const fs = require('fs');
const csv = require('csv-parser');
const db = require('../utils/db');

exports.uploadStatement = (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const transactions = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {

            // Flexible column handling (works with most banks)
            const amount = parseFloat(
                row.Amount ||
                row.amount ||
                row.Debit ||
                row.Credit ||
                0
            );

            const transaction = {
                date: row.Date || row.date || '',
                merchant: row.Description || row.Narration || row.Remarks || 'Unknown',
                amount: amount,
                description: row.Description || '',
                type: amount < 0 ? 'debit' : 'credit',
                category: 'Uncategorized'
            };

            transactions.push(transaction);
        })
        .on('error', (err) => {
            console.error('CSV Parsing Error:', err);
            res.status(500).json({ error: 'Failed to parse CSV file' });
        })
        .on('end', () => {
            if (transactions.length === 0) {
                return res.json({ message: 'No transactions found in file', imported: 0 });
            }

            db.serialize(() => {
                const stmt = db.prepare(`
                    INSERT INTO transactions
                    (date, merchant, amount, description, type, category)
                    VALUES (?, ?, ?, ?, ?, ?)
                `);

                let errors = 0;
                transactions.forEach(txn => {
                    stmt.run(
                        txn.date,
                        txn.merchant,
                        txn.amount,
                        txn.description,
                        txn.type,
                        txn.category,
                        (err) => {
                            if (err) {
                                console.error('Database Insertion Error:', err);
                                errors++;
                            }
                        }
                    );
                });

                stmt.finalize((err) => {
                    if (err) {
                        console.error('Statement Finalization Error:', err);
                        return res.status(500).json({ error: 'Database error during import' });
                    }
                    res.json({
                        message: 'Transactions imported successfully',
                        imported: transactions.length - errors,
                        failed: errors
                    });
                });
            });
        });
};