import { Task } from "../types";
const taskService = {
    getAllTasks: async (): Promise<Task[]> => {
        const response = await fetch("http://localhost:30000/api/tasks");
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        return response.json();
    },

    createTask: async (text: string, tags: string[]): Promise<Task> => {
        const response = await fetch("http://localhost:30000/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, tags }),
        });
        if (!response.ok) {
            throw new Error('Failed to create task');
        }
        return response.json();
    },
    
    addTagsToTask: async (taskId: string, tags: string[]) => {
        const response = await fetch(`http://localhost:30000/api/tasks/${taskId}/tags`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({tags}),
        });

        if (!response.ok) {
            throw new Error("Failed to add tags to task");
        }
        
        return response.json();
    },
};

export default taskService;