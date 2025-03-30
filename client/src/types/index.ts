
export interface Tag {
    id: number;
    name: string;
}
export interface Task {
    id: number;
    text: string;
    completed: boolean;
    tags: string[];
    reminderDate?: string;
    reminderSent?: boolean;
}
  