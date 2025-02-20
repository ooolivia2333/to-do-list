const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./todos.db");

// Create tasks table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT FALSE
        )
    `);
});

module.exports = db;