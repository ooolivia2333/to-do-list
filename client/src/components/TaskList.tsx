import { useState } from "react";
import { Task } from "../types";
import taskService from "../services/taskService";


interface TaskListProps {
    tasks: Task[];
    onTaskUpdate: () => void;
}

function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [newTag, setNewTag] = useState("");

    const handleAddTag = async (taskId: number) => {
        try {
          await taskService.addTagsToTask(taskId.toString(), [newTag]);
          setNewTag("");
          onTaskUpdate();
        } catch (error) {
          console.error("Error adding tag:", error);
        }
    };
    
    const handleToggleComplete = async (taskId: number, completed: boolean) => {
        try {
            await taskService.updateTaskCompletion(taskId.toString(), completed);
            onTaskUpdate();
        } catch (error) {
            console.error("Error toggling complete:", error);
        }
    }

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });

    return (
      <ul className="task-list">
          {sortedTasks.map((task) => (
              <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-content">
                      <div className="task-main">
                          <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={(e) => handleToggleComplete(task.id, e.target.checked)}
                              className="task-checkbox"
                          />
                          <span className="task-text">{task.text}</span>
                      </div>
                      <div className="task-tags">
                          {task.tags.map(tag => (
                              <span key={tag} className="tag">{tag}</span>
                          ))}
                          {editingTaskId === task.id ? (
                              <form onSubmit={(e) => {
                                  e.preventDefault();
                                  handleAddTag(task.id);
                              }}>
                                  <input
                                      type="text"
                                      value={newTag}
                                      onChange={(e) => setNewTag(e.target.value)}
                                      onBlur={() => {
                                        // Small delay to allow form submission if clicked
                                        setTimeout(() => {
                                            setEditingTaskId(null);
                                            setNewTag("");
                                        }, 100);
                                      }}
                                      placeholder="Add tag"
                                      className="tag-input"
                                      autoFocus
                                  />
                              </form>
                          ) : (
                              <button 
                                  className="add-tag-btn"
                                  onClick={() => setEditingTaskId(task.id)}
                              >
                                  +
                              </button>
                          )}
                      </div>
                  </div>
              </li>
          ))}
      </ul>
  );
}

export default TaskList;