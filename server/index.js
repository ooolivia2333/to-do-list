const express = require("express"); // to create a server
const cors = require("cors"); // to allow cross-origin requests
const db = require("./database");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Get all tasks
app.get("/api/tasks", (req, res) => {
    db.all("SELECT * FROM tasks", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add a new task
app.post("/api/tasks", (req, res) => {
    const {text} = req.body;
    db.run("INSERT INTO tasks (text) VALUES (?)", [text], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Task added successfully", id: this.lastID });
    });
});

// Start the server
const PORT = process.env.PORT || 30000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});