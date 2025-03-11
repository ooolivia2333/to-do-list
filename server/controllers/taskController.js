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
    }
}

module.exports = TaskController;