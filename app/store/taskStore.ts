import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task } from "../components/tasks/types";

interface TaskState {
  // Tasks
  tasks: Task[];
  selectedTaskId: string | null;

  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompleted: (taskId: string) => void;
  selectTask: (taskId: string | null) => void;
  clearCompletedTasks: () => void;
  clearAllTasks: () => void;
  resetActualPomodoros: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: [],
      selectedTaskId: null,

      // Set all tasks
      setTasks: (tasks: Task[]) => set({ tasks }),

      // Add a new task
      addTask: (task: Task) => {
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
      },

      // Update an existing task
      updateTask: (updatedTask: Task) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        }));
      },

      // Delete a task
      deleteTask: (taskId: string) => {
        const { selectedTaskId } = get();
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
          // If the deleted task was selected, clear the selection
          selectedTaskId: selectedTaskId === taskId ? null : selectedTaskId,
        }));
      },

      // Toggle task completion status
      toggleTaskCompleted: (taskId: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        }));
      },

      // Select a task
      selectTask: (taskId: string | null) => {
        set({ selectedTaskId: taskId });
      },

      // Clear completed tasks
      clearCompletedTasks: () => {
        const { selectedTaskId } = get();
        const { tasks } = get();
        const completedTaskIds = tasks
          .filter((task) => task.completed)
          .map((task) => task.id);

        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
          // If the selected task was completed and cleared, reset selection
          selectedTaskId: completedTaskIds.includes(selectedTaskId || "")
            ? null
            : selectedTaskId,
        }));
      },

      // Clear all tasks
      clearAllTasks: () => {
        set({ tasks: [], selectedTaskId: null });
      },

      // Reset actual pomodoros for all tasks
      resetActualPomodoros: () => {
        set((state) => ({
          tasks: state.tasks.map((task) => ({
            ...task,
            actualPomodoros: 0,
          })),
        }));
      },
    }),
    {
      name: "pomodoro-tasks-storage", // name for the localStorage key
      partialize: (state) => ({
        tasks: state.tasks,
        selectedTaskId: state.selectedTaskId,
      }),
    }
  )
);

// Selectors
export const getSelectedTask = (state: TaskState) => {
  if (!state.selectedTaskId) {
    // If no task is selected, return the first task or null
    return state.tasks.length > 0 ? state.tasks[0] : null;
  }

  return state.tasks.find((task) => task.id === state.selectedTaskId) || null;
};
