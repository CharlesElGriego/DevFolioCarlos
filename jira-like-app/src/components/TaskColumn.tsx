import React, { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Column } from '../types/Task';
import { TaskCard } from './TaskCard';
import { useTaskContext } from '../context/TaskContext';

/**
 * Props for TaskColumn component
 */
interface TaskColumnProps {
  /** Column data to display */
  column: Column;
  /** Callback when a task is selected for editing */
  onEditTask: (taskId: string) => void;
}

/**
 * Column component that displays a list of tasks
 * Provides functionality to delete non-default columns
 * @param props - Component props
 * @returns {JSX.Element} Column component
 */
export const TaskColumn: React.FC<TaskColumnProps> = ({ column, onEditTask }) => {
  const { deleteColumn, refreshBoard } = useTaskContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
    setErrorMessage('');
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteColumn = () => {
    try {
      const columnId = column.id;
      const columnTitle = column.title;
      console.log(`Initiating deletion of column: ${columnTitle} (${columnId})`);

      deleteColumn(columnId);
      handleCloseDeleteDialog();
      console.log(`Refreshing board after deletion of column: ${columnTitle}`);
      refreshBoard();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        console.error('Error deleting column:', error.message);
      } else {
        setErrorMessage('An unexpected error occurred');
        console.error('Unknown error deleting column');
      }
    }
  };

  return (
    <>
      <div className="task-column">
        <div className="task-column__header">
          <h2 className="task-column__title">{column.title}</h2>
          <div className="task-column__actions">
            {!column.isDefault && (
              <IconButton size="small" onClick={handleOpenDeleteDialog} title="Delete column">
                <Delete />
              </IconButton>
            )}
          </div>
        </div>
        <div className="task-column__tasks">
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task.id)} />
          ))}
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{errorMessage || `Delete column "${column.title}"?`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>{errorMessage ? 'OK' : 'Cancel'}</Button>
          {!errorMessage && (
            <Button onClick={handleDeleteColumn} color="error">
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
