const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', 'database');
const dbPath = path.join(dbDir, 'db.sqlite');

// auto-create folder if missing
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// create tables if they don't exist (data persists across restarts)
db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            active_file TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS transactions(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            date TEXT,
            merchant TEXT,
            amount REAL,
            description TEXT,
            type TEXT,
            category TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
        `);

    db.run(`
        CREATE TABLE IF NOT EXISTS anomalies(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id INTEGER,
            anomaly_type TEXT,
            risk_score INTEGER,
            explanation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(transaction_id) REFERENCES transactions(id)
        )
        `);

    db.run(`
        CREATE TABLE IF NOT EXISTS dismissed_anomalies(
            user_id INTEGER,
            transaction_id INTEGER,
            dismissed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(user_id, transaction_id),
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(transaction_id) REFERENCES transactions(id)
        )
        `);
});

module.exports = db;