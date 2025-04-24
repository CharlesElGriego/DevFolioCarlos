import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskColumn } from '../TaskColumn';
import * as TaskContextModule from '../../context/TaskContext';

const mockColumn = {
  id: 'test-column',
  title: 'Test Column',
  tasks: [],
  isDefault: false,
};

const mockOnEditTask = jest.fn();

// Mock del contexto
jest.mock('../../context/TaskContext', () => {
  const originalModule = jest.requireActual('../../context/TaskContext');
  return {
    ...originalModule,
    useTaskContext: jest.fn(() => ({
      sortColumn: jest.fn(),
      deleteColumn: jest.fn(),
      refreshBoard: jest.fn(),
    })),
  };
});

describe('TaskColumn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders column title', () => {
    render(<TaskColumn column={mockColumn} onEditTask={mockOnEditTask} />);
    expect(screen.getByText('Test Column')).toBeInTheDocument();
  });

  it('opens delete confirmation dialog when delete button is clicked', () => {
    render(<TaskColumn column={mockColumn} onEditTask={mockOnEditTask} />);
    fireEvent.click(screen.getByTitle('Delete column'));
    expect(screen.getByText('Delete column "Test Column"?')).toBeInTheDocument();
  });

  it('closes delete confirmation dialog when cancel is clicked', async () => {
    render(<TaskColumn column={mockColumn} onEditTask={mockOnEditTask} />);
    fireEvent.click(screen.getByTitle('Delete column'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByText('Delete column "Test Column"?')).not.toBeInTheDocument();
    });
  });

  it('calls deleteColumn and refreshBoard when delete is confirmed', async () => {
    const mockContext = {
      sortColumn: jest.fn(),
      deleteColumn: jest.fn(),
      refreshBoard: jest.fn(),
    };

    (TaskContextModule.useTaskContext as jest.Mock).mockReturnValue(mockContext);

    render(<TaskColumn column={mockColumn} onEditTask={mockOnEditTask} />);

    // Abrir el diálogo de confirmación
    fireEvent.click(screen.getByTitle('Delete column'));

    // Confirmar la eliminación
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    // Verificar que se llamaron las funciones
    expect(mockContext.deleteColumn).toHaveBeenCalledWith(mockColumn.id);
    expect(mockContext.refreshBoard).toHaveBeenCalled();
  });
});
