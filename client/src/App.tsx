import { useState, useEffect } from 'react'

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("http://localhost:30000/api/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);
  
  const addTask = () => {
    if (newTask.trim()) {
      fetch("http://localhost:30000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTask }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTasks([...tasks, { id: data.id, text: newTask, completed: false }]);
          setNewTask("");
        })
        .catch((error) => console.error("Error adding task:", error));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        <div className="flex mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border rounded-l"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            Add
          </button>
        </div>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="p-2 border-b">
              {task.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
