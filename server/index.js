const express = require("express"); // to create a server
const cors = require("cors"); // to allow cross-origin requests
const db = require("./database");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/tags", tagRoutes);

// Start the server
const PORT = process.env.PORT || 30000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});