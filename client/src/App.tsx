import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import { Task, Tag } from './types'
function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:30000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        console.log('Tasks from server:', data); // Add this line
        setTasks(data);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:30000/api/tags")
      .then((response) => response.json())
      .then((data) => setTags(data))
      .catch((error) => console.error("Error fetching tags:", error));
  }, []);
  
  
  const addTask = (text: string, tags: string[]) => {
    if (text.trim()) {
      fetch("http://localhost:30000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text, tags: tags }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTasks([...tasks, 
            { id: data.id, text: text, completed: false, tags: tags }]);
          setNewTask("");
        })
        .catch((error) => console.error("Error adding task:", error));
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        tags={tags}
        selectedTags={selectedTags}
        onTagSelect={setSelectedTags}
      />
      <main className="main-content">
        <div className="task-container">
          <h1 className="task-title">Todo List</h1>
          <TaskInput
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
          />
          <TaskList tasks={tasks.filter(task =>
            selectedTags.length === 0 || selectedTags.some(tag => task.tags.includes(tag))
          )} />
        </div>
      </main>
    </div>
  );
}

export default App;
