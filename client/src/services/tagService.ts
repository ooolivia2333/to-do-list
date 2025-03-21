import { Tag } from "../types";

const tagService = {
    getAllTags: async (): Promise<Tag[]> => {
        const response = await fetch("http://localhost:30000/api/tags");
        if (!response.ok) {
            throw new Error('Failed to fetch tags');
        }
        return response.json();
    }
}

export default tagService;