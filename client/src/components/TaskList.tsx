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
    
    
    return (
      <ul className="task-list">
          {tasks.map((task) => (
              <li key={task.id} className="task-item">
                  <div className="task-content">
                      <span>{task.text}</span>
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
                                      placeholder="Add tag"
                                      className="tag-input"
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