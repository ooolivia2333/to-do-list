import { useRef, useState } from "react";
import { Task } from "../types";
import taskService from "../services/taskService";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface TaskListProps {
    tasks: Task[];
    onTaskUpdate: () => void;
}

function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [newTag, setNewTag] = useState("");
    const [showReminderPicker, setShowReminderPicker] = useState<number | null>(null);
    const [newReminderDate, setNewReminderDate] = useState<Date | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    const handleDateTimeChange = (date: Date | null) => {
        if (!date) return;
        
        setNewReminderDate(date);
    };
    
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
    };

    const handleSetReminder = async (taskId: number, date: Date | null) => {
        try {
            await taskService.setReminder(taskId.toString(), date);
            setShowReminderPicker(null);
            onTaskUpdate();
        } catch (error) {
            console.error("Error setting reminder:", error);
        }
    };

    const handleDelete = async (taskId: number) => {
        try {
            await taskService.deleteTask(taskId.toString());
            onTaskUpdate();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const formatReminderDate = (date: Date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    };

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
                          {task.reminderDate && (
                            <span className="reminder-badge" title="Reminder set">
                                {formatReminderDate(new Date(task.reminderDate))}
                            </span>
                          )}
                      </div>
                      <div className="task-tags">
                            {task.tags.map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                            {editingTaskId === task.id ? ( // If we are editing the task, show the form
                                <form onSubmit={(e) => {
                                    e.preventDefault(); // Prevent the default browser submit
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
                        <button 
                            className="reminder-btn"
                            onClick={() => setShowReminderPicker(task.id)}
                            title="Set reminder"
                        >
                            🔔
                        </button>
                        {showReminderPicker === task.id && (
                            <div className="reminder-picker-container" ref={pickerRef}>
                                <DatePicker
                                    selected={newReminderDate || (task.reminderDate ? new Date(task.reminderDate) : null)}
                                    onChange={handleDateTimeChange}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    minDate={new Date()}
                                    inline
                                />
                                <div className="reminder-actions">
                                    <button 
                                        className="confirm-btn"
                                        onClick={() => handleSetReminder(task.id, newReminderDate)}
                                    >
                                        Set Reminder
                                    </button>
                                    <button 
                                        className="cancel-btn"
                                        onClick={() => setShowReminderPicker(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                        <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                            🗑️
                        </button>
                  </div>
              </li>
          ))}
      </ul>
  );
}

export default TaskList;