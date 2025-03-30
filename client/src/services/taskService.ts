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

    updateTaskCompletion: async (taskId: string, completed: boolean) => {
        const response = await fetch(`http://localhost:30000/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ completed }),
        });

        if (!response.ok) {
            throw new Error("Failed to update task completion");
        }
    },

    setReminder: async (taskId: string, reminderDate: Date | null) => {
        const response = await fetch(`http://localhost:30000/api/tasks/${taskId}/reminder`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reminderDate: reminderDate?.toISOString() || null }),
        });

        if (!response.ok) {
            throw new Error("Failed to set reminder");
        }

        return response.json();
    },

    deleteTask: async (taskId: string) => {
        const response = await fetch(`http://localhost:30000/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }
    },
};

export default taskService;