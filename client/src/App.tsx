import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import { Task, Tag } from './types'
import taskService from './services/taskService'
import tagService from './services/tagService'

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchTasks = async () => {
      try {
          const data = await taskService.getAllTasks();
          setTasks(data);
      } catch (error) {
          console.error("Error fetching tasks:", error);
      }
  };

  const fetchTags = async () => {
    try {
      const data = await tagService.getAllTags();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };
  
  useEffect(() => {
    fetchTasks();
    fetchTags();
  }, []);
  
  const addTask = async (text: string, tags: string[]) => {
      if (text.trim()) {
          try {
              const newTask = await taskService.createTask(text, tags);
              setTasks([...tasks, newTask]);
              setNewTask("");
          } catch (error) {
              console.error("Error adding task:", error);
          }
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
          )} onTaskUpdate={() => {
            fetchTasks();
            fetchTags();
          }} />
        </div>
      </main>
    </div>
  );
}

export default App;
