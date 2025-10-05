export interface Task {
    id?: string;
    uid: string;
    title: string;
    notes?: string;
    done: boolean;
    priority: 'low' | 'med' | 'high';
    dueAt?: number;
    createdAt: number;
    updatedAt: number;
  }