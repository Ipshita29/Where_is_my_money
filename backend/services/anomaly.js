/**
 * Detects anomalies in a list of transactions.
 * @param {Array} transactions - List of transaction objects (must have id, amount, merchant, date, category).
 * @returns {Array} - List of detected anomalies.
 */
exports.detectAnomalies = (transactions) => {
    const anomalies = [];
    const merchantGroups = {};

    transactions.forEach(txn => {
        const amount = Math.abs(txn.amount || 0);

        // 1. High Value Transaction (> 1000)
        if (amount > 1000 && txn.amount < 0) {
            anomalies.push({
                transaction_id: txn.id,
                anomaly_type: 'High Value',
                risk_score: 80,
                explanation: `Transaction of ${amount} exceeds the $1000 threshold.`
            });
        }

        // 2. Uncategorized High Amount
        if (txn.category === 'Other' && amount > 500 && txn.amount < 0) {
            anomalies.push({
                transaction_id: txn.id,
                anomaly_type: 'Uncategorized Expense',
                risk_score: 40,
                explanation: `High value expense (${amount}) to an unknown/uncategorized merchant.`
            });
        }

        // Grouping for frequency check
        if (txn.amount < 0 && txn.merchant && txn.date) {
            const day = txn.date.substring(0, 10);
            const key = `${txn.merchant}_${day}`;
            if (!merchantGroups[key]) merchantGroups[key] = [];
            merchantGroups[key].push(txn);
        }
    });

    // 3. Repeated Small Transactions (Frequency Check)
    // If same merchant has > 2 transactions < $10 in the same day
    Object.values(merchantGroups).forEach(group => {
        const smallTxns = group.filter(t => Math.abs(t.amount) < 10);
        if (smallTxns.length > 2) {
            smallTxns.forEach(t => {
                anomalies.push({
                    transaction_id: t.id,
                    anomaly_type: 'High Frequency',
                    risk_score: 50,
                    explanation: `Part of a series of ${smallTxns.length} small transactions to the same merchant on the same day.`
                });
            });
        }
    });

    return anomalies;
};
