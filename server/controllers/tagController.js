const TagModel = require("../models/tagModel");

const TagController = {
    getAllTags: async (req, res) => {
        try {
            const tags = await TagModel.getAllTags();
            res.json(tags);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },
    createTag: async (req, res) => {
        try {
            const {name} = req.body;
            const result = await TagModel.createTag(name);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = TagController;