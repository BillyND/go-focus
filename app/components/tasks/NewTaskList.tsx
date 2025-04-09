import React, { useState, memo } from "react";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import { TaskMenu } from "./TaskMenu";
import { TaskMenuAction } from "../../constants";
import { Task } from "./types";
import { TaskEditor } from "../tasks/TaskEditor";
import { useTaskStore } from "../../store/taskStore";
import { useTimerStore } from "../../store/timerStore";
import { TimerMode } from "../../constants";

interface TaskListProps {
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
  onEdit,
  isSelected,
}: TaskItemProps & { onEdit: (task: Task) => void; isSelected?: boolean }) {
  // Tracks for each task are completed / estimated pomodoros
  const pomodoroRatio = `${task.actualPomodoros || 0}/${
    task.estimatedPomodoros || 1
  }`;

  return (
    <div
      className={`mb-2 py-3 px-4 bg-white rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
        isSelected ? "border-l-4 border-l-gray-800" : ""
      }`}
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

      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm">{pomodoroRatio}</span>
        <button
          className="text-gray-400 hover:text-gray-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation(); // Prevent task selection when clicking edit
            onEdit(task);
          }}
          aria-label="Edit task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
          </svg>
        </button>
      </div>
    </div>
  );
});

export default function NewTaskList({
  currentPomodoroCount,
  targetPomodoroCount,
  finishTime,
  finishTimeIsRelative = true,
  relativeTimeText = "(0.2h)",
  onAddTask,
}: TaskListProps) {
  // Get current timer mode for the header title when no task is selected
  const timerMode = useTimerStore((state) => state.mode);
  const modeLabels: Record<TimerMode, string> = {
    pomodoro: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  // Task store state
  const {
    tasks,
    selectedTaskId,
    addTask: storeAddTask,
    updateTask: storeUpdateTask,
    deleteTask: storeDeleteTask,
    toggleTaskCompleted,
    selectTask,
    clearCompletedTasks,
    clearAllTasks,
    resetActualPomodoros,
  } = useTaskStore();

  // Find the selected task or get the first task if none is selected
  const selectedTask = selectedTaskId
    ? tasks.find((t) => t.id === selectedTaskId)
    : tasks.length > 0
    ? tasks[0]
    : null;

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle clicking on a task (select/unselect)
  const handleTaskClick = (task: Task) => {
    // If clicking on the already selected task, unselect it
    if (selectedTaskId === task.id) {
      selectTask(null);
    } else {
      // Otherwise, select the clicked task
      selectTask(task.id);
    }
  };

  // Handle opening the edit dialog
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  // Add a new task
  const addTask = (taskTitle: string, estimatedPomodoros: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle,
      completed: false,
      createdAt: Date.now(),
      estimatedPomodoros,
      actualPomodoros: 0,
    };

    storeAddTask(newTask);
    setIsAddingTask(false);

    // If this is the first task, automatically select it
    if (tasks.length === 0) {
      selectTask(newTask.id);
    }

    // Call the onAddTask callback if provided
    if (onAddTask) onAddTask();
  };

  // Update an existing task
  const updateTask = (taskTitle: string, estimatedPomodoros: number) => {
    if (!editingTask) return;

    const updatedTask: Task = {
      ...editingTask,
      title: taskTitle,
      estimatedPomodoros,
    };

    storeUpdateTask(updatedTask);
    setEditingTask(null);

    // Call the onAddTask callback if provided
    if (onAddTask) onAddTask();
  };

  // Handle menu actions
  const handleMenuAction = (action: TaskMenuAction) => {
    switch (action) {
      case TaskMenuAction.CLEAR_FINISHED:
        clearCompletedTasks();
        break;
      case TaskMenuAction.CLEAR_ALL:
        clearAllTasks();
        break;
      case TaskMenuAction.CLEAR_ACT_POMODOROS:
        resetActualPomodoros();
        break;
      // Other actions would be implemented here
    }

    setIsMenuOpen(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header with task title and menu */}
      <div className="text-center mb-2">
        <div className="text-xl text-white font-medium">
          {selectedTask?.title || modeLabels[timerMode]}
        </div>
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
              onClick={handleTaskClick}
              onToggleComplete={toggleTaskCompleted}
              onEdit={handleEditTask}
              isSelected={selectedTask?.id === task.id}
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
      {(editingTask || isAddingTask) && (
        <TaskEditor
          task={editingTask}
          isOpen={true}
          onClose={() => {
            setEditingTask(null);
            setIsAddingTask(false);
          }}
          onSave={editingTask ? updateTask : addTask}
          onDelete={
            editingTask ? () => storeDeleteTask(editingTask.id) : undefined
          }
        />
      )}
    </div>
  );
}
