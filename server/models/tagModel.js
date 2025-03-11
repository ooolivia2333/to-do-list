const db = require("../database/database");

const TagModel = {
    getAllTags: async () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM tags`;
            db.all(query, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    },
    createTag: async (name) => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO tags (name) VALUES (?)`, [name], function(err) {
                if (err) reject(err);
                resolve({id: this.lastID, name});
            });
        });
    }
}

module.exports = TagModel;