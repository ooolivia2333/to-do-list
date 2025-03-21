const db = require("../database/database");

const TaskModel = {
    getAllTasks: () => {
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

    createTask: (text, tags) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");
                
                db.run("INSERT INTO tasks (text) VALUES (?)", [text], function(err) {
                    if (err) {
                        db.run("ROLLBACK");
                        reject(err);
                        return;
                    }
                    
                    const taskId = this.lastID;
                    
                    // If no tags, commit and return
                    if (!tags || tags.length === 0) {
                        db.run("COMMIT");
                        resolve({ id: taskId, text, tags: [] });
                        return;
                    }

                    // Process tags
                    let completed = 0;
                    let hasError = false;

                    tags.forEach((tagName) => {
                        // First ensure the tag exists
                        db.run("INSERT OR IGNORE INTO tags (name) VALUES (?)", [tagName], function(err) {
                            if (err && !hasError) {
                                hasError = true;
                                db.run("ROLLBACK");
                                reject(err);
                                return;
                            }

                            // Get the tag id
                            db.get("SELECT id FROM tags WHERE name = ?", [tagName], (err, tag) => {
                                if (err && !hasError) {
                                    hasError = true;
                                    db.run("ROLLBACK");
                                    reject(err);
                                    return;
                                }

                                // Link tag to task
                                db.run(
                                    "INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)",
                                    [taskId, tag.id],
                                    (err) => {
                                        if (err && !hasError) {
                                            hasError = true;
                                            db.run("ROLLBACK");
                                            reject(err);
                                            return;
                                        }

                                        completed++;
                                        if (completed === tags.length && !hasError) {
                                            db.run("COMMIT");
                                            resolve({ id: taskId, text, tags });
                                        }
                                    }
                                );
                            });
                        });
                    });
                });
            });
        });
    },
    addTagsToTask: (taskId, tags) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");

                let completed = 0;
                let hasError = false;

                tags.forEach((tagName) => {
                    // ensure tag exists
                    db.run("INSERT OR IGNORE INTO tags (name) values (?)",
                        [tagName], function(err) {
                            if (err && !hasError) {
                                hasError = true;
                                db.run("ROLLBACK");
                                return reject(err);
                            }
                            
                            // get tag id
                            db.get("SELECT id FROM tags WHERE name = ?",
                                [tagName], (err, tag) => {
                                    if (err && !hasError) {
                                        hasError = true;
                                        db.run("ROLLBACK");
                                        return reject(err);
                                    }

                                    // link tag to task
                                    db.run(
                                        "INSERT OR IGNORE INTO task_tags (task_id, tag_id) VALUES (?, ?)",
                                        [taskId, tag.id],
                                        (err) => {
                                            if (err && !hasError) {
                                                hasError = true;
                                                db.run("ROLLBACK");
                                                return reject(err);
                                            }

                                            completed++;
                                            if (completed === tags.length && !hasError) {
                                                db.run("COMMIT");
                                                resolve({id: taskId, tags});
                                            }
                                        }
                                    )
                                }
                            )
                        }
                    )
                })
            })
        })
    }
};

module.exports = TaskModel;
