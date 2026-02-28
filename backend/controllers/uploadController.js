const fs = require('fs');
const csv = require('csv-parser');
const db = require('../utils/db');
const PDFParser = require('pdf2json');
const path = require('path');

const { categorizeMerchant } = require('../services/categorize');
const { detectAnomalies } = require('../services/anomaly');

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
            // Clean up file and reject
            fs.unlink(filePath, () => { });
            return res.status(400).json({ error: 'Unsupported file format. Please upload a CSV or PDF.' });
        }

        // Clean up uploaded temp file
        fs.unlink(filePath, () => { });

        if (transactions.length === 0) {
            return res.json({
                message: 'No transactions could be extracted from this file. Please check the format.',
                imported: 0
            });
        }

        // Bulk insert via serialize, but FIRST delete old ones
        let imported = 0;
        let failed = 0;

        await new Promise((resolve, reject) => {
            db.serialize(() => {
                // 1. Delete old transactions and anomalies
                db.run(`DELETE FROM dismissed_anomalies WHERE user_id = ?`, [userId]);
                db.run(`DELETE FROM anomalies WHERE transaction_id IN (SELECT id FROM transactions WHERE user_id = ?)`, [userId]);
                db.run(`DELETE FROM transactions WHERE user_id = ?`, [userId], (err) => {
                    if (err) console.error("Error clearing old transactions:", err.message);
                });

                // 2. Update active file
                db.run(`UPDATE users SET active_file = ? WHERE id = ?`, [req.file.originalname, userId], (err) => {
                    if (err) console.error("Error updating active file:", err.message);
                });

                // 3. Insert new transactions
                const stmt = db.prepare(`
                    INSERT INTO transactions
                    (user_id, date, merchant, amount, description, type, category)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `);

                transactions.forEach(txn => {
                    stmt.run(
                        [userId, txn.date, txn.merchant, txn.amount, txn.description, txn.type, txn.category],
                        (err) => {
                            if (err) {
                                console.error('Insert error:', err.message);
                                failed++;
                            } else {
                                imported++;
                            }
                        }
                    );
                });

                stmt.finalize((err) => {
                    if (err) {
                        console.error('Finalize error:', err.message);
                        return reject(err);
                    }
                    resolve();
                });
            });
        });

        return res.json({
            message: 'Transactions imported successfully',
            imported,
            failed,
            total: transactions.length
        });

    } catch (err) {
        // Clean up uploaded file on error
        fs.unlink(filePath, () => { });
        console.error('Upload error:', err.message);
        return res.status(500).json({ error: `Failed to process file: ${err.message}` });
    }
};

// ─── CSV Parser ───────────────────────────────────────────────────────────────
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Support multiple common CSV column name styles
                const rawAmount =
                    row.Amount || row.amount ||
                    row.Debit || row.debit ||
                    row.Credit || row.credit || 0;

                const amount = parseFloat(String(rawAmount).replace(/[^0-9.\-]/g, '')) || 0;

                const merchant =
                    row.Description || row.description ||
                    row.Merchant || row.merchant ||
                    row.Narration || row.narration ||
                    row.Remarks || row.remarks ||
                    row.Payee || row.payee || 'Unknown';

                const date =
                    row.Date || row.date ||
                    row['Transaction Date'] ||
                    row['Value Date'] ||
                    new Date().toISOString().split('T')[0];

                results.push({
                    date: normalizeDate(date),
                    merchant: String(merchant).trim(),
                    amount: amount,
                    description: String(merchant).trim(),
                    type: amount < 0 ? 'debit' : 'credit',
                    category: categorizeMerchant(String(merchant))
                });
            })
            .on('error', reject)
            .on('end', () => resolve(results));
    });
};

// ─── PDF Parser ───────────────────────────────────────────────────────────────
const parsePDF = (filePath) => {
    return new Promise((resolve, reject) => {
        const parser = new PDFParser(this, 1);
        const transactions = [];

        parser.on('pdfParser_dataError', errData => {
            reject(new Error(errData.parserError));
        });

        parser.on('pdfParser_dataReady', pdfData => {
            const tempText = parser.getRawTextContent();

            const lines = tempText
                .split('\n')
                .map(l => l.replace(/\s+/g, ' ').trim())
                .filter(Boolean);

            /*
            Handles formats like:
            2026-02-14 Netflix Subscription -649 Debit 69,452
            2026-02-28 Freelance Payment +12000 Credit 53,003
            */

            // Regex looks for: Date (YYYY-MM-DD), merchant string, amount (can have +/- and commas), Debit/Credit
            const txnRegex = /^(\d{4}-\d{2}-\d{2})\s+(.+?)\s+([+-]?[\d,]+)\s+(Debit|Credit)/i;

            lines.forEach(line => {
                const match = line.match(txnRegex);
                if (!match) return;

                const [, dateStr, description, amountStr, drcr] = match;

                let amount = parseFloat(amountStr.replace(/,/g, '').replace(/\+/g, ''));

                // Some banks just provide positive numbers and use Debit/Credit flags
                // If the number itself isn't already negative and it's a debit, make it negative
                if (drcr.toLowerCase() === 'debit' && amount > 0) {
                    amount = -amount;
                }

                transactions.push({
                    date: dateStr, // already YYYY-MM-DD
                    merchant: description.trim(),
                    amount,
                    description: description.trim(),
                    type: amount < 0 ? 'debit' : 'credit',
                    category: categorizeMerchant(description)
                });
            });

            console.log(`PDF parsed: ${lines.length} lines → ${transactions.length} transactions extracted`);
            resolve(transactions);
        });

        parser.loadPDF(filePath);
    });
};