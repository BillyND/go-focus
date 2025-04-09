import React, { useState, useEffect, memo } from "react";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import { TaskMenu } from "./TaskMenu";
import { TaskMenuAction } from "../../constants";
import { Task } from "./types";
import { TaskEditor } from "../tasks/TaskEditor";

interface TaskListProps {
  title: string;
  currentPomodoroCount: number;
  targetPomodoroCount: number;
  finishTime: string;
  finishTimeIsRelative?: boolean;
  relativeTimeText?: string;
  onAddTask?: () => void;
}

interface TaskItemProps {
  task: Task;
  onClick: (task: Task) => void;
  onToggleComplete: (id: string) => void;
}

// Individual task item component
const TaskItem = memo(function TaskItem({
  task,
  onClick,
  onToggleComplete,
}: TaskItemProps) {
  // Tracks for each task are completed / estimated pomodoros
  const pomodoroRatio = `${task.actualPomodoros || 0}/${
    task.estimatedPomodoros || 1
  }`;

  return (
    <div
      className="mb-2 py-3 px-4 bg-white rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-50"
      onClick={() => onClick(task)}
    >
      <div className="flex items-center">
        <button
          className={`flex-shrink-0 w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center mr-3
            ${task.completed ? "bg-gray-500" : "bg-transparent"}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id);
          }}
          aria-label={
            task.completed ? "Mark as incomplete" : "Mark as complete"
          }
        >
          {task.completed && <span className="text-white text-xs">✓</span>}
        </button>
        <span
          className={`text-gray-800 ${
            task.completed ? "line-through opacity-60" : ""
          }`}
        >
          {task.title}
        </span>
      </div>

      <span className="text-gray-500 text-sm">{pomodoroRatio}</span>
    </div>
  );
});

export default function NewTaskList({
  title,
  currentPomodoroCount,
  targetPomodoroCount,
  finishTime,
  finishTimeIsRelative = true,
  relativeTimeText = "(0.2h)",
  onAddTask,
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage on initialization
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("pomodoro-tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    }
    return [];
  });

  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pomodoro-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Toggle task completion
  const toggleTaskCompleted = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Add a new task
  const addTask = (title: string, estimatedPomodoros: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: title,
      completed: false,
      createdAt: Date.now(),
      estimatedPomodoros,
      actualPomodoros: 0,
    };

    setTasks([...tasks, newTask]);
    setIsAddingTask(false);
  };

  // Update an existing task
  const updateTask = (title: string, estimatedPomodoros: number) => {
    if (!currentTask) return;

    const updatedTask: Task = {
      ...currentTask,
      title,
      estimatedPomodoros,
    };

    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setCurrentTask(null);

    // Call the onAddTask callback if provided
    if (onAddTask) onAddTask();
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    setCurrentTask(null);
  };

  // Handle menu actions
  const handleMenuAction = (action: TaskMenuAction) => {
    switch (action) {
      case TaskMenuAction.CLEAR_FINISHED:
        setTasks(tasks.filter((task) => !task.completed));
        break;
      case TaskMenuAction.CLEAR_ALL:
        setTasks([]);
        break;
      case TaskMenuAction.CLEAR_ACT_POMODOROS:
        setTasks(tasks.map((task) => ({ ...task, actualPomodoros: 0 })));
        break;
      // Other actions would be implemented here
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header with task title and menu */}
      <div className="text-center mb-2">
        <div className="text-sm text-white/80">#{currentPomodoroCount}</div>
        <div className="text-xl text-white font-medium">{title}</div>
      </div>

      {/* Tasks section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white">Tasks</h2>
          <div className="relative">
            <button
              className="text-white p-2 hover:bg-white/10 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FaEllipsisV />
            </button>
            <TaskMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onAction={handleMenuAction}
            />
          </div>
        </div>

        <div className="space-y-1">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onClick={setCurrentTask}
              onToggleComplete={toggleTaskCompleted}
            />
          ))}
        </div>

        {/* Add task button */}
        <button
          className="w-full mt-4 py-3 flex items-center justify-center text-white/80 border-2 border-dashed border-white/30 rounded-md hover:bg-white/5"
          onClick={() => setIsAddingTask(true)}
        >
          <FaPlus className="mr-2" />
          Add Task
        </button>
      </div>

      {/* Timer info footer */}
      <div className="flex justify-between items-center text-white mt-6 border-t border-white/20 pt-4">
        <div>
          Pomos:{" "}
          <span className="font-semibold">
            {currentPomodoroCount}/{targetPomodoroCount}
          </span>
        </div>
        <div>
          Finish At: <span className="font-semibold">{finishTime}</span>
          {finishTimeIsRelative && (
            <span className="ml-1 text-sm opacity-70">{relativeTimeText}</span>
          )}
        </div>
      </div>

      {/* Task editor dialog */}
      {(currentTask || isAddingTask) && (
        <TaskEditor
          task={currentTask}
          isOpen={true}
          onClose={() => {
            setCurrentTask(null);
            setIsAddingTask(false);
          }}
          onSave={currentTask ? updateTask : addTask}
          onDelete={currentTask ? () => deleteTask(currentTask.id) : undefined}
        />
      )}
    </div>
  );
}
