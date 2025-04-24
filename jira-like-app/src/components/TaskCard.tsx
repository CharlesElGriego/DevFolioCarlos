import React from 'react';
import { IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { Task } from '../types/Task';
import { useTaskContext } from '../context/TaskContext';

/**
 * Props for TaskCard component
 */
interface TaskCardProps {
  /** Task data to display */
  task: Task;
  /** Callback when edit button is clicked */
  onEdit: () => void;
}

/**
 * Card component that displays task details
 * Provides functionality to toggle favorite status and delete task
 * @param props - Component props
 * @returns {JSX.Element} Task card component
 */
export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { refreshBoard } = useTaskContext();

  return (
    <div className="task-card">
      <div className="task-card__header">
        <h3 className="task-card__title">{task.name}</h3>
      </div>
      <div className="task-card__deadline">Due: {new Date(task.deadline).toLocaleDateString()}</div>
      <p className="task-card__description">{task.description}</p>
      {task.image && <img src={task.image} alt="Task attachment" className="task-card__image" />}
      <div className="task-card__actions">
        <IconButton size="small" onClick={onEdit}>
          <Edit />
        </IconButton>
      </div>
    </div>
  );
};
