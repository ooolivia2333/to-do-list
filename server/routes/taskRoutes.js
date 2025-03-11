const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/taskController");

router.get("/", TaskController.getAllTasks);
router.post("/", TaskController.createTask);

module.exports = router;