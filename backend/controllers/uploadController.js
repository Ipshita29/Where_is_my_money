const fs = require('fs');
const csv = require('csv-parser');
const db = require('../utils/db');
const pdf = require('pdf-parse'); // v1.1.1 — simple async function API
const path = require('path');

const { categorizeMerchant } = require('../services/categorize');

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

        // Bulk insert via serialize
        let imported = 0;
        let failed = 0;

        await new Promise((resolve, reject) => {
            db.serialize(() => {
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
const parsePDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);   // pdf-parse v1 simple API
    const text = data.text;

    const transactions = [];
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // Multiple regex patterns to cover different bank statement formats
    const patterns = [
        // Pattern 1: YYYY-MM-DD  Description  -1234.56
        /^(\d{4}-\d{2}-\d{2})\s+(.+?)\s+(-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*$/,
        // Pattern 2: DD/MM/YYYY  Description  -1234.56
        /^(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+(-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*$/,
        // Pattern 3: MM/DD/YYYY  Description  Amount
        /^(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+(-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*$/,
        // Pattern 4: DD MMM YYYY  Description  1,234.56 (with optional Dr/Cr at end)
        /^(\d{2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4})\s+(.+?)\s+(-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)(?:\s+(?:Dr|Cr))?\s*$/i,
    ];

    lines.forEach(line => {
        for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match) {
                const [, dateStr, description, amountStr] = match;
                const amount = parseFloat(amountStr.replace(/,/g, ''));
                if (!isNaN(amount)) {
                    transactions.push({
                        date: normalizeDate(dateStr),
                        merchant: description.trim(),
                        amount: amount,
                        description: description.trim(),
                        type: amount < 0 ? 'debit' : 'credit',
                        category: categorizeMerchant(description.trim())
                    });
                    break; // matched, stop trying other patterns
                }
            }
        }
    });

    console.log(`PDF parsed: ${lines.length} lines → ${transactions.length} transactions extracted`);
    return transactions;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function normalizeDate(raw) {
    if (!raw) return new Date().toISOString().split('T')[0];
    raw = raw.trim();

    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

    // DD/MM/YYYY → YYYY-MM-DD
    const dmy = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;

    // MM/DD/YYYY → YYYY-MM-DD
    const mdy = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (mdy) return `${mdy[3]}-${mdy[1]}-${mdy[2]}`;

    // Try native Date parse as fallback
    try {
        const d = new Date(raw);
        if (!isNaN(d)) return d.toISOString().split('T')[0];
    } catch (_) { }

    return new Date().toISOString().split('T')[0];
}