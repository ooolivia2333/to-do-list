interface Task {
    id: number;
    text: string;
    completed: boolean;
}

interface TaskListProps {
    tasks: Task[];
}

function TaskList({ tasks }: TaskListProps) {
    return (
        <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                {task.text}
              </li>
            ))}
          </ul>
    );
}

export default TaskList;