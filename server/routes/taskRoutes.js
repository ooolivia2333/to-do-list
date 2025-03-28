const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/taskController");

router.get("/", TaskController.getAllTasks);
router.post("/", TaskController.createTask);
router.post("/:taskId/tags", TaskController.addTagsToTask);
router.patch("/:taskId", TaskController.updateTaskCompletion);

module.exports = router;