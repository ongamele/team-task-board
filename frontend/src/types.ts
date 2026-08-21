export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface User {
    id: string;
    name: string;
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    assigneeId: string | null;
    assignee: User | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    assigneeId?: string;
}

export interface TaskFilters {
    status?: TaskStatus;
    assigneeId?: string;
}
