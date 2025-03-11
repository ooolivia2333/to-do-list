const db = require("../database/database");

const TaskModel = {
    getAllTasks: async () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    t.*,
                    GROUP_CONCAT(tag.name) as tags
                FROM tasks t
                LEFT JOIN task_tags tt ON t.id = tt.task_id
                LEFT JOIN tags tag ON tt.tag_id = tag.id
                GROUP BY t.id
            `;
            db.all(query, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    },
    createTask: async (text, tags) => {
        return new Promise((resolve, reject) => {
            db.run(`BEGIN TRANSACTION`)
            db.run(`INSERT INTO tasks (text) VALUES (?)`, [text], function(err) {
                if (err) {
                    db.run(`ROLLBACK`); 
                    reject(err);
                    return;
                }
                const taskId = this.lastID;

                // Add tags
                if (tags && tags.length > 0) {
                    tags.forEach((tag) => {
                        db.run(`INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)`, [taskId, tag], (err) => {
                            if (err) reject(err);
                        });
                    });
                }
            });
        });
    }
}
