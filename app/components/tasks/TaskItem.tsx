import { useState, useRef, useEffect } from "react";
import { FaTrash, FaPen, FaGripVertical } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./types";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

export function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  // DnD-kit integration
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
      <div
        className="mb-2 p-3 rounded-lg border border-white/30 bg-white/10 shadow-lg"
        ref={setNodeRef}
        style={style}
      >
        <div className="flex items-center gap-2">
          <input
            ref={editInputRef}
            type="text"
            className="flex-grow bg-white/20 border-0 rounded-md px-3 py-2 text-white"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group mb-2 p-3 rounded-lg border border-white/20 bg-white/10 flex items-center transition-all hover:bg-white/20`}
    >
      {/* Drag Handle */}
      <div
        className="text-white/50 hover:text-white cursor-grab active:cursor-grabbing mr-2 flex-shrink-0"
        {...attributes}
        {...listeners}
      >
        <FaGripVertical size={16} />
      </div>

      {/* Checkbox */}
      <button
        className={`flex-shrink-0 w-5 h-5 rounded-full border border-white/60 flex items-center justify-center mr-3
          ${
            task.completed ? "bg-white/80" : "bg-transparent hover:bg-white/20"
          }`}
        onClick={() => onToggleComplete(task.id)}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed && <span className="text-current text-xs">✓</span>}
      </button>

      {/* Task Title */}
      <span
        className={`flex-grow text-white ${
          task.completed ? "line-through opacity-60" : ""
        }`}
      >
        {task.title}
      </span>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="text-white/60 hover:text-white transition-colors"
          onClick={handleStartEditing}
          aria-label="Edit task"
        >
          <FaPen size={12} />
        </button>
        <button
          className="text-white/60 hover:text-white transition-colors"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          <FaTrash size={12} />
        </button>
      </div>
    </div>
  );
}
