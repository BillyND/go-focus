import { useState, useRef, useEffect } from "react";
import { FaPlay, FaCheck, FaTrash, FaPen } from "react-icons/fa";
import { Button } from "../ui/Button";
import { Task } from "./types";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onStartTimerWithTask: (title: string) => void;
}

export function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  onStartTimerWithTask,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEditing = () => {
    setEditTitle(task.title);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle) {
      onEdit(task.id, trimmedTitle);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-3 rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={editInputRef}
            type="text"
            className="flex-grow border rounded-md px-2 py-1 text-sm"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveEdit}
            aria-label="Save task"
          >
            <FaCheck size={12} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3 rounded-lg border ${
        task.completed
          ? "border-gray-200 bg-gray-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${
              task.completed ? "border-gray-400 bg-gray-400" : "border-gray-300"
            }`}
          onClick={() => onToggleComplete(task.id)}
          aria-label={
            task.completed ? "Mark as incomplete" : "Mark as complete"
          }
        >
          {task.completed && <FaCheck size={10} className="text-white" />}
        </button>

        <span
          className={`flex-grow ${
            task.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {task.title}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="icon"
            size="sm"
            onClick={() => onStartTimerWithTask(task.title)}
            aria-label="Start timer with this task"
          >
            <FaPlay size={12} />
          </Button>
          <Button
            variant="icon"
            size="sm"
            onClick={handleStartEditing}
            aria-label="Edit task"
          >
            <FaPen size={12} />
          </Button>
          <Button
            variant="icon"
            size="sm"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <FaTrash size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
