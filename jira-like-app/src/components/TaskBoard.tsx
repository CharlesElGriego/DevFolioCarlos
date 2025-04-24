import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { TaskColumn } from './TaskColumn';
import { TaskForm } from './TaskForm';
import { useTaskContext } from '../context/TaskContext';
import { Task } from '../types/Task';
import { columnSchema } from '../schemas/taskSchema';
import { ZodError } from 'zod';

/**
 * Main task board component.
 * Displays all columns and provides functionality to add tasks and columns.
 * @returns {JSX.Element} Task board component
 */
export const TaskBoard: React.FC = () => {
  const { columns, addColumn } = useTaskContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isColumnFormOpen, setIsColumnFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [columnError, setColumnError] = useState('');

  /**
   * Handles editing an existing task
   * @param taskId - ID of the task to edit
   */
  const handleEditTask = (taskId: string) => {
    const task = columns.flatMap((col) => col.tasks).find((t) => t.id === taskId);
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  /**
   * Closes task form and resets its state
   */
  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setSelectedTask(undefined);
  };

  /**
   * Closes column form and resets its state
   */
  const handleCloseColumnForm = () => {
    setIsColumnFormOpen(false);
    setNewColumnTitle('');
    setColumnError('');
  };

  /**
   * Handles adding a new column
   * Validates column title before creation
   */
  const handleAddColumn = () => {
    try {
      columnSchema.parse({ title: newColumnTitle });
      addColumn(newColumnTitle.trim());
      handleCloseColumnForm();
    } catch (error) {
      if (error instanceof ZodError) {
        setColumnError(error.errors[0].message);
      }
    }
  };

  return (
    <div className="task-board">
      <div className="task-board__actions">
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedTask(undefined);
            setIsTaskFormOpen(true);
          }}
        >
          Add Task
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={() => setIsColumnFormOpen(true)}>
          Add Column
        </Button>
      </div>

      <div className="task-board__columns">
        {columns.map((column) => (
          <TaskColumn key={column.id} column={column} onEditTask={handleEditTask} />
        ))}
      </div>

      <TaskForm open={isTaskFormOpen} onClose={handleCloseTaskForm} task={selectedTask} />

      <Dialog open={isColumnFormOpen} onClose={handleCloseColumnForm}>
        <DialogTitle>Add New Column</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Column Title"
            fullWidth
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            error={!!columnError}
            helperText={columnError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseColumnForm}>Cancel</Button>
          <Button onClick={handleAddColumn} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
