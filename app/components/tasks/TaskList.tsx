import { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useTimerStore } from "../../store/timerStore";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/Card";
import { TaskItem } from "./TaskItem";
import { Task } from "./types";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage on initialization
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("pomodoro-tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    }
    return [];
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Current pomodoro count for displaying alongside tasks
  const completedPomodoros = useTimerStore((state) => state.completedPomodoros);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pomodoro-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    const trimmedTitle = newTaskTitle.trim();
    if (!trimmedTitle) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: trimmedTitle,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");

    // Focus back on the input for quick additional task entry
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle form submission for adding a task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask();
  };

  // Toggle a task's completed status
  const toggleTaskCompleted = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Edit a task
  const editTask = (id: string, newTitle: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  };

  // Start the timer with a specific task
  const startTimerWithTask = (taskTitle: string) => {
    // Set timer to pomodoro mode and start it
    useTimerStore.getState().resetTimer("pomodoro");
    useTimerStore.getState().startTimer();

    // Show toast notification with task title
    toast.info(`Starting focus timer for: ${taskTitle}`);
  };

  // Count completed and remaining tasks
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const remainingTasksCount = tasks.length - completedTasksCount;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-xl font-medium">Tasks</h2>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Task Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              className="flex-grow border rounded-md px-3 py-2 text-sm"
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!newTaskTitle.trim()}
              aria-label="Add task"
            >
              <FaPlus size={14} />
            </Button>
          </div>
        </form>

        {/* Task List */}
        {tasks.length > 0 ? (
          <div className="space-y-2 mt-4">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskCompleted}
                onDelete={deleteTask}
                onEdit={editTask}
                onStartTimerWithTask={startTimerWithTask}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8 border border-dashed border-gray-200 rounded-lg">
            No tasks yet. Add a task to get started.
          </div>
        )}
      </CardContent>

      {/* Task Stats */}
      {tasks.length > 0 && (
        <CardFooter>
          <div className="text-xs text-gray-500">
            {completedTasksCount} completed / {remainingTasksCount} remaining
          </div>
          <div className="text-xs text-gray-500">
            Total pomodoros: {completedPomodoros}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
