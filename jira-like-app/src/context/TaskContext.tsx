import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task, Column } from '../types/Task';

/**
 * Interface defining the shape of the TaskContext.
 * Provides methods for managing tasks and columns in the task board.
 */
interface TaskContextType {
  /** Array of all columns in the task board */
  columns: Column[];
  /**
   * Adds a new task to a specific column
   * @param task - Task data without ID (generated automatically)
   */
  addTask: (task: Omit<Task, 'id'>) => void;
  /**
   * Updates an existing task
   * @param task - Complete task data including ID
   */
  editTask: (task: Task) => void;
  /**
   * Removes a task from its column
   * @param taskId - ID of the task to delete
   */
  deleteTask: (taskId: string) => void;
  /**
   * Moves a task to a different column
   * @param taskId - ID of the task to move
   * @param targetColumn - ID of the destination column
   */
  moveTask: (taskId: string, targetColumn: string) => void;
  /**
   * Creates a new column
   * @param title - Title of the new column
   */
  addColumn: (title: string) => void;
  /**
   * Removes a column and all its tasks
   * @param columnId - ID of the column to delete
   * @throws {Error} If attempting to delete a default column
   */
  deleteColumn: (columnId: string) => void;
  /**
   * Refreshes the board data from localStorage
   * Forces a re-render with the latest data
   */
  refreshBoard: () => void;
}

/** Task management context */
const TaskContext = createContext<TaskContextType | undefined>(undefined);

/** Default columns created on first load */
const defaultColumns: Column[] = [
  { id: '1', title: 'To Do', tasks: [], isDefault: true },
  { id: '2', title: 'In Progress', tasks: [], isDefault: true },
  { id: '3', title: 'Done', tasks: [], isDefault: true },
];

/**
 * Provider component for task management functionality.
 * Handles state management and persistence for tasks and columns.
 */
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clean up any potential inconsistent state at startup
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('taskColumns');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Validate data structure
        if (!Array.isArray(parsedData)) {
          localStorage.setItem('taskColumns', JSON.stringify(defaultColumns));
        }
      }
    } catch (error) {
      console.error('Error processing localStorage on init:', error);
      try {
        localStorage.setItem('taskColumns', JSON.stringify(defaultColumns));
      } catch (e) {
        console.error('Failed to write to localStorage:', e);
      }
    }
  }, []);

  const [columns, setColumns] = useState<Column[]>(() => {
    try {
      const saved = localStorage.getItem('taskColumns');
      if (!saved) return defaultColumns;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : defaultColumns;
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      return defaultColumns;
    }
  });

  // Persist columns state to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem('taskColumns', JSON.stringify(columns));
    } catch (error) {
      console.error('Failed to persist columns to localStorage:', error);
    }
  }, [columns]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
    };

    setColumns((prev) =>
      prev.map((col) => (col.id === task.column ? { ...col, tasks: [...col.tasks, newTask] } : col))
    );
  };

  /**
   * Refreshes the board data by reloading from localStorage
   * Useful to ensure UI is in sync with stored data
   */
  const refreshBoard = () => {
    console.log('Refreshing board from localStorage');
    const saved = localStorage.getItem('taskColumns');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        console.log(`Loaded ${parsedData.length} columns from localStorage`);
        setColumns(parsedData);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
        setColumns(defaultColumns);
      }
    } else {
      console.log('No data found in localStorage, using defaults');
      setColumns(defaultColumns);
    }
  };

  const editTask = (updatedTask: Task) => {
    // Find the old task to get its current column
    const oldTask = columns.flatMap((col) => col.tasks).find((task) => task.id === updatedTask.id);

    if (!oldTask) return;

    // Create new columns array with the task moved/updated
    const newColumns = columns.map((col) => {
      // Remove task from old column
      const filteredTasks = col.tasks.filter((task) => task.id !== updatedTask.id);

      // If this is the target column, add the updated task
      if (col.id === updatedTask.column) {
        return {
          ...col,
          tasks: [...filteredTasks, updatedTask],
        };
      }

      // Otherwise just return the column with the task removed (if it was there)
      return {
        ...col,
        tasks: filteredTasks,
      };
    });

    // Update state and localStorage in one go
    setColumns(newColumns);
    localStorage.setItem('taskColumns', JSON.stringify(newColumns));
  };

  const deleteTask = (taskId: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task.id !== taskId),
      }))
    );
  };

  const moveTask = (taskId: string, targetColumn: string) => {
    const taskToMove = columns.flatMap((col) => col.tasks).find((task) => task.id === taskId);

    if (!taskToMove) return;

    const updatedTask = {
      ...taskToMove,
      column: targetColumn,
    };

    const columnsWithTaskRemoved = columns.map((col) => ({
      ...col,
      tasks: col.tasks.filter((task) => task.id !== taskId),
    }));

    const updatedColumns = columnsWithTaskRemoved.map((col) => {
      if (col.id === targetColumn) {
        return {
          ...col,
          tasks: [...col.tasks, updatedTask],
        };
      }
      return col;
    });

    setColumns(updatedColumns);
  };

  const addColumn = (title: string) => {
    const newColumn: Column = {
      id: crypto.randomUUID(),
      title,
      tasks: [],
      isDefault: false,
    };
    setColumns((prev) => [...prev, newColumn]);
  };

  const deleteColumn = (columnId: string) => {
    // Verify this isn't a default column
    const column = columns.find((col) => col.id === columnId);
    if (!column) return;

    if (column.isDefault) {
      throw new Error('Cannot delete default column');
    }

    // Check if column has tasks
    if (column.tasks.length > 0) {
      throw new Error('Cannot delete column with tasks');
    }

    // Delete the column
    console.log(`Deleting column ${columnId}`);
    const newColumns = columns.filter((col) => col.id !== columnId);
    setColumns(newColumns);

    // Force update in localStorage
    localStorage.setItem('taskColumns', JSON.stringify(newColumns));
  };

  return (
    <TaskContext.Provider
      value={{
        columns,
        addTask,
        editTask,
        deleteTask,
        moveTask,
        addColumn,
        deleteColumn,
        refreshBoard,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

/**
 * Hook to access the task management context.
 * @throws {Error} If used outside of TaskProvider
 * @returns {TaskContextType} Task management context
 */
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
