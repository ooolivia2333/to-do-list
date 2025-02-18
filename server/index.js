const express = require("express"); // to create a server
const cors = require("cors"); // to allow cross-origin requests

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Hello from the backlend!");
});

// Start the server
const PORT = process.env.PORT || 30000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});