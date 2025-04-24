import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskBoard } from '../TaskBoard';
import { TaskProvider } from '../../context/TaskContext';
import { BrowserRouter } from 'react-router-dom';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <TaskProvider>{ui}</TaskProvider>
    </BrowserRouter>
  );
};

describe('TaskBoard', () => {
  it('renders add task and add column buttons', () => {
    renderWithProviders(<TaskBoard />);

    expect(screen.getByText('Add Task')).toBeInTheDocument();
    expect(screen.getByText('Add Column')).toBeInTheDocument();
  });

  it('opens task form when add task button is clicked', () => {
    renderWithProviders(<TaskBoard />);

    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByText('Add Task', { selector: 'form *' })).toBeInTheDocument();
  });

  it('opens column form when add column button is clicked', () => {
    renderWithProviders(<TaskBoard />);

    fireEvent.click(screen.getByText('Add Column'));
    expect(screen.getByText('Add New Column')).toBeInTheDocument();
  });

  it('renders default columns', () => {
    renderWithProviders(<TaskBoard />);

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});
