const TaskModel = require("../models/taskModel");

const TaskController = {
    getAllTasks: async (req, res) => {
        try {
            const tasks = await TaskModel.getAllTasks();
            const tasksWithTags = tasks.map(task => ({
                ...task,
                tags: task.tags ? task.tags.split(",") : []
            }));
            res.json(tasksWithTags);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },
    createTask: async (req, res) => {
        try {
            const {text, tags} = req.body;
            const result = await TaskModel.createTask(text, tags);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },
    addTagsToTask: async (req, res) => {
        try {
            const taskId = parseInt(req.params.taskId);
            const {tags} = req.body;
            const result = await TaskModel.addTagsToTask(taskId, tags);
            res.json(result);
        } catch (error) {
            res.status(500).json({error:error.message});
        }
    },
    updateTaskCompletion: async (req, res) => {
        try {
            const taskId = parseInt(req.params.taskId);
            const {completed} = req.body;

            if (isNaN(taskId)) {
                return res.status(400).json({error: "Invalid task ID"});
            }

            const result = await TaskModel.updateTaskCompletion(taskId, completed);
            res.json(result);
        } catch (error) {
            console.error("Error updating task completion:", error);
            res.status(500).json({error: error.message});
        }
    }
};

module.exports = TaskController;