export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  order?: number; // Optional order for drag-and-drop sorting
}
