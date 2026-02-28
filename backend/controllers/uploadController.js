const fs = require('fs');
const csv = require('csv-parser');
const db = require('../utils/db');
const pdf = require('pdf-parse');
const path = require('path');

exports.uploadStatement = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const userId = req.user.id;
    let transactions = [];

    try {
        if (fileExt === '.csv') {
            transactions = await parseCSV(filePath);
        } else if (fileExt === '.pdf') {
            transactions = await parsePDF(filePath);
        } else {
            return res.status(400).json({ error: 'Unsupported file format. Use CSV or PDF.' });
        }

        if (transactions.length === 0) {
            return res.json({ message: 'No transactions found in file', imported: 0 });
        }

        db.serialize(() => {
            const stmt = db.prepare(`
                INSERT INTO transactions
                (user_id, date, merchant, amount, description, type, category)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            let errors = 0;
            transactions.forEach(txn => {
                stmt.run(
                    [userId, txn.date, txn.merchant, txn.amount, txn.description, txn.type, txn.category],
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

    } catch (err) {
        console.error('Upload Processing Error details:', err);
        res.status(500).json({ error: 'Failed to process file: ' + err.message });
    }
};

const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const amount = parseFloat(
                    row.Amount || row.amount || row.Debit || row.Credit || 0
                );
                results.push({
                    date: row.Date || row.date || new Date().toISOString().split('T')[0],
                    merchant: row.Description || row.Narration || row.Remarks || 'Unknown',
                    amount: amount,
                    description: row.Description || '',
                    type: amount < 0 ? 'debit' : 'credit',
                    category: 'Uncategorized'
                });
            })
            .on('error', reject)
            .on('end', () => resolve(results));
    });
};

const parsePDF = async (filePath) => {
    // Note: PDF parsing is highly dependent on the PDF's structure.
    // This implementation is a basic attempt and may require significant
    // refinement and testing for different bank statement formats.
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        const text = data.text;
        const transactions = [];

        // Improved regex for common statement formats: Date Description Amount
        // Example: 2025-02-01 Walmart -50.00
        const lines = text.split('\n');
        const dateRegex = /^(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})/;
        const amountRegex = /\s(-?\d+\.\d{2})$/;

        lines.forEach(line => {
            const dateMatch = line.trim().match(dateRegex);
            const amountMatch = line.trim().match(amountRegex);

            if (dateMatch && amountMatch) {
                const date = dateMatch[0];
                const amountStr = amountMatch[1]; // Use capturing group
                const amount = parseFloat(amountStr);

                let description = line.trim().replace(date, '').replace(amountStr, '').trim();

                transactions.push({
                    date: date,
                    merchant: description || 'Unknown',
                    amount: amount,
                    description: description,
                    type: amount < 0 ? 'debit' : 'credit',
                    category: 'Uncategorized'
                });
            }
        });

        return transactions;
    } catch (err) {
        console.error('PDF Parse Error:', err);
        throw new Error('PDF parsing failed: ' + err.message);
    }
};