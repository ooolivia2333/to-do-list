const db = require("../database/database");

const TaskModel = {
    getAllTasks: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    t.id,
                    t.text,
                    t.completed,
                    t.reminder_date as reminderDate,
                    t.reminder_sent as reminderSent,
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
    },
    updateTaskCompletion: (taskId, completed) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE tasks
                SET completed = ?
                WHERE id = ?
            `;

            db.run(query, [completed, taskId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                const selectQuery = `
                    SELECT
                        t.id,
                        t.text,
                        t.completed,
                        t.reminder_date as reminderDate,
                        t.reminder_sent as reminderSent,
                        GROUP_CONCAT(tag.name) as tags
                    FROM tasks t
                    LEFT JOIN task_tags tt ON t.id = tt.task_id
                    LEFT JOIN tags tag ON tt.tag_id = tag.id
                    WHERE t.id = ?
                `;

                db.get(selectQuery, [taskId], (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(row);
                });
            });
        });
    },

    setReminder: (taskId, reminderDate) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE tasks
                SET reminder_date = ?,
                    reminder_sent = false
                WHERE id = ?
            `;

            db.run(query, [reminderDate, taskId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const selectQuery = `
                    SELECT
                        t.id,
                        t.text,
                        t.completed,
                        t.reminder_date as reminderDate,
                        t.reminder_sent as reminderSent,
                        GROUP_CONCAT(tag.name) as tags
                    FROM tasks t
                    LEFT JOIN task_tags tt ON t.id = tt.task_id
                    LEFT JOIN tags tag ON tt.tag_id = tag.id
                    WHERE t.id = ?
                `;

                db.get(selectQuery, [taskId], (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(row);
                });
            });
        });
    },
    deleteTask: (taskId) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");

                db.run("DELETE FROM task_tags WHERE task_id = ?", [taskId], (err) => {
                    if (err) {
                        db.run("ROLLBACK");
                        reject(err);
                        return;
                    }

                    db.run("DELETE FROM tasks WHERE id = ?", [taskId], (err) => {
                        if (err) {
                            db.run("ROLLBACK");
                            reject(err);
                            return;
                        }

                        db.run(`
                            DELETE FROM tags
                            WHERE id NOT IN (
                                SELECT DISTINCT tag_id
                                FROM task_tags
                            )
                        `, [], (err) => {
                            if (err) {
                                db.run("ROLLBACK");
                                reject(err);
                                return;
                            }

                            db.run("COMMIT");
                            resolve();
                        })
                        
                        
                    })
                })
            })
        })
    }
};

module.exports = TaskModel;
