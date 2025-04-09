import React, { useState, useEffect, useRef } from "react";
import { FaRegTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import { Task } from "./types";

interface TaskEditorProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (title: string, estimatedPomodoros: number) => void;
  onDelete?: () => void;
}

export function TaskEditor({
  isOpen,
  task,
  onClose,
  onSave,
  onDelete,
}: TaskEditorProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(
    task?.estimatedPomodoros || 1
  );
  const [notes, setNotes] = useState(task?.notes || "");
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local state when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setEstimatedPomodoros(task.estimatedPomodoros || 1);
      setNotes(task.notes || "");
    } else {
      setTitle("");
      setEstimatedPomodoros(1);
      setNotes("");
    }
  }, [task]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim(), estimatedPomodoros);
    }
  };

  // Handle estimated pomodoros change
  const changeEstimatedPomodoros = (increment: boolean) => {
    setEstimatedPomodoros((prev) => {
      if (increment) {
        return prev + 1;
      } else {
        return Math.max(1, prev - 1);
      }
    });
  };

  if (!isOpen) return null;

  const isNewTask = !task;
  const modalTitle = isNewTask ? "What are you working on?" : task.title;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-md overflow-hidden"
      >
        <form onSubmit={handleSubmit}>
          {isNewTask ? (
            <div className="p-4">
              <input
                ref={inputRef}
                type="text"
                className="w-full text-lg px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-gray-500"
                placeholder="What are you working on?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="py-4 px-6 border-b border-gray-200">
              <h3 className="font-medium text-xl text-gray-800">
                {modalTitle}
              </h3>
            </div>
          )}

          <div className="p-6 space-y-6">
            {!isNewTask && (
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Task Name
                </label>
                <input
                  ref={inputRef}
                  id="title"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isNewTask ? "Est Pomodoros" : "Act / Est Pomodoros"}
              </label>

              {!isNewTask && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 bg-gray-100 p-2 rounded-md text-center">
                    {task.actualPomodoros || 0}
                  </div>
                  <div className="text-gray-400">/</div>
                  <div className="flex-1 bg-gray-100 p-2 rounded-md text-center">
                    {estimatedPomodoros}
                  </div>
                  <button
                    type="button"
                    className="p-2 border rounded-md"
                    onClick={() => changeEstimatedPomodoros(true)}
                  >
                    <FaPlus size={12} />
                  </button>
                  <button
                    type="button"
                    className="p-2 border rounded-md"
                    onClick={() => changeEstimatedPomodoros(false)}
                    disabled={estimatedPomodoros <= 1}
                  >
                    <FaMinus size={12} />
                  </button>
                </div>
              )}

              {isNewTask && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 p-2 rounded-md text-center">
                    {estimatedPomodoros}
                  </div>
                  <button
                    type="button"
                    className="p-2 border rounded-md"
                    onClick={() => changeEstimatedPomodoros(true)}
                  >
                    <FaPlus size={12} />
                  </button>
                  <button
                    type="button"
                    className="p-2 border rounded-md"
                    onClick={() => changeEstimatedPomodoros(false)}
                    disabled={estimatedPomodoros <= 1}
                  >
                    <FaMinus size={12} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes
              </label>
              <textarea
                id="notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 resize-none"
                placeholder="Some notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {!isNewTask && onDelete && (
              <div className="pt-2">
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800 flex items-center gap-2"
                  onClick={onDelete}
                >
                  <FaRegTrashAlt /> Delete
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 py-3 px-6 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              disabled={!title.trim()}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
