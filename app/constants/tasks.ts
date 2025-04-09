// Task related constants

// Task priority levels
export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

// Task menu actions
export enum TaskMenuAction {
  CLEAR_FINISHED = "clearFinished",
  USE_TEMPLATE = "useTemplate",
  IMPORT_FROM_TODOIST = "importFromTodoist",
  CLEAR_ACT_POMODOROS = "clearActPomodoros",
  HIDE_TASKS = "hideTasks",
  CLEAR_ALL = "clearAll",
}

// Task menu items with locked state
export const TASK_MENU_ITEMS = [
  {
    id: TaskMenuAction.CLEAR_FINISHED,
    label: "Clear finished tasks",
    icon: "trash",
    locked: false,
  },
  {
    id: TaskMenuAction.USE_TEMPLATE,
    label: "Use Template",
    icon: "template",
    locked: false,
  },
  {
    id: TaskMenuAction.IMPORT_FROM_TODOIST,
    label: "Import from Todoist",
    icon: "import",
    locked: true,
  },
  {
    id: TaskMenuAction.CLEAR_ACT_POMODOROS,
    label: "Clear act pomodoros",
    icon: "check",
    locked: false,
  },
  {
    id: TaskMenuAction.HIDE_TASKS,
    label: "Hide tasks",
    icon: "eye",
    locked: true,
  },
  {
    id: TaskMenuAction.CLEAR_ALL,
    label: "Clear all tasks",
    icon: "trash",
    locked: false,
  },
];

// Default task values
export const DEFAULT_TASK = {
  title: "",
  completed: false,
  estimatedPomodoros: 1,
  actualPomodoros: 0,
  notes: "",
};
