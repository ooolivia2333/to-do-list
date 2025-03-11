import { Tag } from '../types';

interface TaskInputProps {
    newTask: string;
    setNewTask: (task: string) => void;
    addTask: (text: string, tags: string[]) => void;
    availableTags: Tag[];
}

function TaskInput({ newTask, setNewTask, addTask }: TaskInputProps) {
    const handleAddTask = () => {
        addTask(newTask, []); // For now, passing empty tags array
    };

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
                onClick={handleAddTask}
                className="task-add-button"
            >
                Add
            </button>
        </div>
    );
}

export default TaskInput;
