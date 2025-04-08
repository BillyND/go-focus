import { useState, useRef, useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { useTimerStore } from "../../store/timerStore";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { MemoizedTaskItem } from "./TaskItem";
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Current pomodoro count for displaying alongside tasks
  const completedPomodoros = useTimerStore((state) => state.completedPomodoros);

  // Get the active task for the overlay
  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeId),
    [activeId, tasks]
  );

  // DnD kit configuration with optimized settings
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Increase activation constraint for more intentional drags
      activationConstraint: {
        delay: 100, // Add a small delay to prevent accidental drags
        tolerance: 8, // Slightly more tolerant than default
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Create a memoized array of task IDs for the sortable context
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

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
      order: tasks.length, // Add ordering for drag and drop
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

  // Handle the start of a drag operation
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  // Handle the end of a drag operation
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null); // Clear active id regardless of outcome

    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex).map((task, index) => ({
          ...task,
          order: index,
        }));
      });
    }
  };

  // Handle cancellation of drag operation
  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Count completed and remaining tasks
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const remainingTasksCount = tasks.length - completedTasksCount;

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Add Task Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center w-full">
            <input
              ref={inputRef}
              type="text"
              className="flex-grow bg-white/10 border-0 rounded-l-md px-4 py-3 text-white placeholder-white/60"
              placeholder="What are you working on?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button
              type="submit"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-r-md transition-colors"
              disabled={!newTaskTitle.trim()}
              aria-label="Add task"
            >
              <FaPlus size={14} />
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="mt-6">
          <h2 className="text-xl font-medium text-white mb-4">Tasks</h2>

          {tasks.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
              modifiers={[restrictToParentElement]}
            >
              <SortableContext
                items={taskIds}
                strategy={verticalListSortingStrategy}
              >
                <div ref={listRef} className="relative">
                  {tasks.map((task) => (
                    <MemoizedTaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskCompleted}
                      onDelete={deleteTask}
                      onEdit={editTask}
                    />
                  ))}
                </div>
              </SortableContext>

              {/* Drag Overlay for visual feedback during drag */}
              <DragOverlay adjustScale={false}>
                {activeId && activeTask && (
                  <div className="p-3 rounded-lg border border-white/30 bg-white/20 shadow-lg w-full">
                    <div className="flex items-center">
                      <div className="mr-2 flex-shrink-0">
                        <FaPlus className="opacity-0" size={14} />
                      </div>
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full border border-white/60 flex items-center justify-center mr-3
                          ${
                            activeTask.completed
                              ? "bg-white/80"
                              : "bg-transparent"
                          }`}
                      >
                        {activeTask.completed && (
                          <span className="text-current text-xs">✓</span>
                        )}
                      </div>
                      <span
                        className={`flex-grow text-white ${
                          activeTask.completed ? "line-through opacity-60" : ""
                        }`}
                      >
                        {activeTask.title}
                      </span>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          ) : (
            <div className="text-center text-white/70 py-8 border border-dashed border-white/20 rounded-lg">
              Add tasks to get started
            </div>
          )}
        </div>
      </div>

      {/* Task Stats */}
      {tasks.length > 0 && (
        <div className="mt-6 text-white/70 flex justify-between">
          <div className="text-sm">
            {completedTasksCount} completed / {remainingTasksCount} remaining
          </div>
          <div className="text-sm">{completedPomodoros} pomodoros</div>
        </div>
      )}
    </div>
  );
}
