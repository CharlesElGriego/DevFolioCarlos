import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../TaskCard';
import * as TaskContextModule from '../../context/TaskContext';

const mockTask = {
  id: '1',
  name: 'Test Task',
  description: 'Test Description',
  deadline: '2024-03-20',
  column: '1',
  favorite: false,
  image: 'test-image.jpg',
};

// Mock task context
jest.mock('../../context/TaskContext', () => {
  const originalModule = jest.requireActual('../../context/TaskContext');

  return {
    ...originalModule,
    useTaskContext: jest.fn().mockReturnValue({
      refreshBoard: jest.fn(),
    }),
  };
});

describe('TaskCard', () => {
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByAltText('Task attachment')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />);

    fireEvent.click(screen.getByTestId('EditIcon').parentElement!);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });
});
