export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  order?: number; // Optional order for drag-and-drop sorting
  estimatedPomodoros?: number; // Estimated number of pomodoros needed
  actualPomodoros?: number; // Actual number of pomodoros completed
  notes?: string; // Optional notes about the task
}
