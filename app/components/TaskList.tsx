import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaCheck, FaTrash, FaPen, FaPlus } from "react-icons/fa";
import { useTimerStore } from "../store/timerStore";
import { TimerMode } from "../constants";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

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
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Current pomodoro count for displaying alongside tasks
  const completedPomodoros = useTimerStore((state) => state.completedPomodoros);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pomodoro-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Focus the input field when editing a task
  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTaskId]);

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

    // If we're editing this task, cancel the edit
    if (editingTaskId === id) {
      setEditingTaskId(null);
    }
  };

  // Start editing a task
  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  // Save edited task
  const saveEditedTask = () => {
    if (!editingTaskId) return;

    const trimmedTitle = editingTaskTitle.trim();
    if (!trimmedTitle) return;

    setTasks(
      tasks.map((task) =>
        task.id === editingTaskId ? { ...task, title: trimmedTitle } : task
      )
    );

    setEditingTaskId(null);
    setEditingTaskTitle("");
  };

  // Cancel task editing
  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditingTaskTitle("");
  };

  // Handle keydown in the edit field
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      cancelEditingTask();
    } else if (e.key === "Enter") {
      saveEditedTask();
    }
  };

  // Start the timer with a specific task
  const startTimerWithTask = (taskTitle: string) => {
    // Set timer to pomodoro mode and start it
    useTimerStore.getState().resetTimer(TimerMode.POMODORO);
    useTimerStore.getState().startTimer();

    // Show toast notification with task title
    toast.info(`Starting focus timer for: ${taskTitle}`);
  };

  // Count completed and remaining tasks
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const remainingTasksCount = tasks.length - completedTasksCount;

  return (
    <div className="w-full max-w-md mx-auto my-8">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            className="input flex-grow"
            placeholder="Add a task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary btn-icon"
            disabled={!newTaskTitle.trim()}
          >
            <FaPlus size={16} />
          </button>
        </div>
      </form>

      {/* Task List */}
      {tasks.length > 0 ? (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className={`p-3 rounded-lg border ${
                  task.completed
                    ? "border-foreground/10 bg-foreground/5"
                    : "border-foreground/20"
                }`}
              >
                {editingTaskId === task.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      ref={editInputRef}
                      type="text"
                      className="input flex-grow"
                      value={editingTaskTitle}
                      onChange={(e) => setEditingTaskTitle(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      onBlur={saveEditedTask}
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-icon"
                      onClick={saveEditedTask}
                    >
                      <FaCheck size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <button
                      className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-foreground/30 flex items-center justify-center"
                      onClick={() => toggleTaskCompleted(task.id)}
                    >
                      {task.completed && (
                        <FaCheck size={10} className="text-foreground/70" />
                      )}
                    </button>

                    <span
                      className={`flex-grow ${
                        task.completed ? "line-through text-foreground/50" : ""
                      }`}
                    >
                      {task.title}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        className="btn btn-icon btn-ghost p-1"
                        onClick={() => startTimerWithTask(task.title)}
                      >
                        <FaPlay size={12} />
                      </button>
                      <button
                        className="btn btn-icon btn-ghost p-1"
                        onClick={() => startEditingTask(task)}
                      >
                        <FaPen size={12} />
                      </button>
                      <button
                        className="btn btn-icon btn-ghost p-1"
                        onClick={() => deleteTask(task.id)}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center text-foreground/50 p-8 border border-dashed border-foreground/20 rounded-lg">
          No tasks yet. Add a task to get started.
        </div>
      )}

      {/* Task Stats */}
      {tasks.length > 0 && (
        <div className="mt-4 flex justify-between text-sm text-foreground/60">
          <span>
            {completedTasksCount} completed / {remainingTasksCount} remaining
          </span>
          <span>Total pomodoros: {completedPomodoros}</span>
        </div>
      )}
    </div>
  );
}
