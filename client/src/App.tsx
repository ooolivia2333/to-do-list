import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
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
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="task-container">
          <h1 className="task-title">Todo List</h1>
          <TaskInput
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
          />
          <TaskList tasks={tasks} />
        </div>
      </main>
    </div>
  );
}

export default App;
