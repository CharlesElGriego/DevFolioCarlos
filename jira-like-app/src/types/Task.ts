/**
 * Represents a task in the task management system.
 * @interface Task
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Name/title of the task */
  name: string;
  /** Optional detailed description of the task */
  description?: string;
  /** Due date of the task in ISO string format */
  deadline: string;
  /** ID of the column this task belongs to */
  column: string;
  /** Optional base64 encoded image attachment */
  image?: string;
}

/**
 * Represents a column in the task board.
 * @interface Column
 */
export type Column = {
  /** Unique identifier for the column */
  id: string;
  /** Display title of the column */
  title: string;
  /** List of tasks in this column */
  tasks: Task[];
  /** Whether this is a default column that cannot be deleted */
  isDefault?: boolean;
};
