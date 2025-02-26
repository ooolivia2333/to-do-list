interface TaskInputProps {
    newTask: string;
    setNewTask: (task: string) => void;
    addTask: () => void;
}

function TaskInput({ newTask, setNewTask, addTask }: TaskInputProps) {
    return (
        <div className="task-input">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="task-input-field"
            />
            <button
              onClick={addTask}
              className="task-add-button"
            >
              Add
            </button>
        </div>
    );
}

export default TaskInput;
