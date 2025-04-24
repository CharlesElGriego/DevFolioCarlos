import React from 'react';
import { render, screen, fireEvent, within, waitFor, act } from '@testing-library/react';
import { TaskForm } from '../TaskForm';
import { TaskProvider } from '../../context/TaskContext';
import { useTaskContext } from '../../context/TaskContext';
import * as TaskContextModule from '../../context/TaskContext';

// Mock context to track refreshBoard calls
jest.mock('../../context/TaskContext', () => {
  const originalModule = jest.requireActual('../../context/TaskContext');
  return {
    ...originalModule,
    useTaskContext: jest.fn(() => ({
      columns: [
        { id: '1', title: 'To Do', tasks: [] },
        { id: '2', title: 'In Progress', tasks: [] },
        { id: '3', title: 'Done', tasks: [] },
      ],
      addTask: jest.fn(),
      editTask: jest.fn(),
      refreshBoard: jest.fn(),
    })),
  };
});

const mockTask = {
  id: '1',
  name: 'Test Task',
  description: 'Test Description',
  deadline: '2024-03-20',
  column: '1',
  favorite: false,
};

// Helper component to initialize tasks
const StateInitializer = () => {
  const { addTask } = useTaskContext();
  React.useEffect(() => {
    // Add the mock task to column 1
    addTask({
      name: mockTask.name,
      description: mockTask.description,
      deadline: mockTask.deadline,
      column: mockTask.column,
      favorite: mockTask.favorite,
    });
  }, []);
  return null;
};

// Mock component to verify context updates
const ContextChecker = ({ columnId }: { columnId: string }) => {
  const { columns } = useTaskContext();
  const columnTasks = columns.find((col) => col.id === columnId)?.tasks || [];
  const taskInColumn = columnTasks.some((t) => t.name === 'Test Task');
  return <div data-testid="context-check">{taskInColumn ? 'found' : 'not-found'}</div>;
};

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<TaskProvider>{ui}</TaskProvider>);
};

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to use actual context for tests that use renderWithProvider
    (TaskContextModule.useTaskContext as jest.Mock).mockImplementation(
      jest.requireActual('../../context/TaskContext').useTaskContext
    );
  });

  it('renders form fields correctly', () => {
    const onClose = jest.fn();
    renderWithProvider(<TaskForm open={true} onClose={onClose} />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Deadline/i)).toBeInTheDocument();
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });

  it('populates form with task data when editing', () => {
    const onClose = jest.fn();
    renderWithProvider(<TaskForm open={true} onClose={onClose} task={mockTask} />);

    expect(screen.getByLabelText(/Name/i)).toHaveValue('Test Task');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('Test Description');
    expect(screen.getByLabelText(/Deadline/i)).toHaveValue('2024-03-20');
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = jest.fn();
    renderWithProvider(<TaskForm open={true} onClose={onClose} />);

    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onClose).toHaveBeenCalled();
  });

  it('handles form submission', () => {
    const onClose = jest.fn();
    renderWithProvider(<TaskForm open={true} onClose={onClose} />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'New Task' },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'New Description' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it('moves task to new column when column is changed in edit mode', async () => {
    // This test uses the actual context implementation via renderWithProvider
    const onClose = jest.fn();

    // Render with state initializer to set up tasks
    renderWithProvider(
      <>
        <StateInitializer />
        <TaskForm open={true} onClose={onClose} task={mockTask} />
        <ContextChecker columnId="2" />
      </>
    );

    // Open column select
    const select = screen.getByLabelText(/Column/i);
    fireEvent.mouseDown(select);

    // Select new column (assuming "In Progress" is column 2)
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText(/In Progress/i));

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    // Wait for state updates to complete
    await waitFor(() => {
      expect(screen.getByTestId('context-check')).toHaveTextContent('found');
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('calls refreshBoard after editing a task', async () => {
    // This test uses the mocked context
    const mockContext = {
      columns: [
        { id: '1', title: 'To Do', tasks: [] },
        { id: '2', title: 'In Progress', tasks: [] },
      ],
      addTask: jest.fn(),
      editTask: jest.fn(),
      refreshBoard: jest.fn(),
    };

    (TaskContextModule.useTaskContext as jest.Mock).mockReturnValue(mockContext);

    const onClose = jest.fn();
    // Crear una versión modificada de mockTask para simular un cambio de columna
    const editingTask = { ...mockTask, column: '1' };
    render(<TaskForm open={true} onClose={onClose} task={editingTask} />);

    // Cambiar columna a "In Progress"
    const select = screen.getByLabelText(/Column/i);
    fireEvent.mouseDown(select);
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText(/In Progress/i));

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    // Verificar que refreshBoard fue llamado
    expect(mockContext.editTask).toHaveBeenCalled();
    expect(mockContext.refreshBoard).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
