import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  FormHelperText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Task } from '../types/Task';
import { useTaskContext } from '../context/TaskContext';
import { taskSchema, TaskFormData } from '../schemas/taskSchema';
import { ZodError } from 'zod';

// Styled components
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    '& .MuiSvgIcon-root': {
      transition: 'transform 0.2s ease-in-out',
    },
  },
  '& .MuiSelect-select': {
    padding: '14px',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: '8px 16px',
}));

/**
 * Props for TaskForm component
 */
interface TaskFormProps {
  /** Whether the form dialog is open */
  open: boolean;
  /** Callback when the form is closed */
  onClose: () => void;
  /** Task data for editing, undefined for new task */
  task?: Task;
}

/**
 * Form component for creating and editing tasks
 * Handles validation and submission of task data
 * @param props - Component props
 * @returns {JSX.Element} Task form component
 */
export const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, task }) => {
  const { columns, addTask, editTask, refreshBoard } = useTaskContext();
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    deadline: new Date().toISOString().split('T')[0],
    column: columns[0]?.id || '',
    favorite: false,
    image: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Reset form data when task prop changes
   */
  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description || '',
        deadline: new Date(task.deadline).toISOString().split('T')[0],
        column: task.column,
        favorite: task.favorite,
        image: task.image || '',
      });
    } else {
      // Reset form when opening for new task
      setFormData({
        name: '',
        description: '',
        deadline: new Date().toISOString().split('T')[0],
        column: columns[0]?.id || '',
        favorite: false,
        image: '',
      });
    }
    setErrors({});
  }, [task, open, columns]);

  /**
   * Validates form data using Zod schema
   * @returns {boolean} Whether the form data is valid
   */
  const validateForm = () => {
    try {
      taskSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  /**
   * Handles form submission
   * Validates data and calls appropriate context method
   * @param e - Form submit event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (task) {
        // Asegurarnos que la columna se actualice correctamente
        const updatedTask = { ...formData, id: task.id };

        // Solo si la columna ha cambiado, usamos una lógica especial
        if (task.column !== updatedTask.column) {
          // Primero eliminar de la columna anterior
          const oldColumnId = task.column;
          const newColumnId = updatedTask.column;

          // Usar moveTask en lugar de editTask para cambio de columna
          editTask(updatedTask);

          // Forzar la actualización para asegurar que la UI refleje el cambio
          // Usar directamente refreshBoard sin setTimeout para facilitar testing
          refreshBoard();
        } else {
          // Si no cambia la columna, editTask normal
          editTask(updatedTask);
        }
      } else {
        addTask(formData);
      }
      onClose();
    }
  };

  /**
   * Handles image file upload
   * Converts image to base64 string
   * @param e - File input change event
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{task ? 'Edit Task' : 'Add Task'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              error={!!errors.name}
              helperText={errors.name}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
              error={!!errors.deadline}
              helperText={errors.deadline}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <StyledFormControl error={!!errors.column}>
              <InputLabel id="column-select-label">Column</InputLabel>
              <Select
                labelId="column-select-label"
                value={formData.column}
                onChange={(e) => setFormData((prev) => ({ ...prev, column: e.target.value }))}
                label="Column"
                required
              >
                {columns.map((col) => (
                  <StyledMenuItem key={col.id} value={col.id}>
                    {col.title}
                  </StyledMenuItem>
                ))}
              </Select>
              {errors.column && <FormHelperText>{errors.column}</FormHelperText>}
            </StyledFormControl>
            <Button variant="outlined" component="label" fullWidth>
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
            {formData.image && (
              <Box mt={2}>
                <img
                  src={formData.image}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 200 }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {task ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
