import React from 'react';
import { render, act, renderHook, waitFor } from '@testing-library/react';
import { TaskProvider, useTaskContext } from '../TaskContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Default columns for testing
const defaultColumns = [
  { id: '1', title: 'To Do', tasks: [], isDefault: true },
  { id: '2', title: 'In Progress', tasks: [], isDefault: true },
  { id: '3', title: 'Done', tasks: [], isDefault: true },
];

describe('TaskContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with default columns', () => {
    const { result } = renderHook(() => useTaskContext(), {
      wrapper: TaskProvider,
    });
    expect(result.current.columns).toHaveLength(3);
    expect(result.current.columns[0].title).toBe('To Do');
    expect(result.current.columns[0].isDefault).toBe(true);
    expect(result.current.columns[1].title).toBe('In Progress');
    expect(result.current.columns[1].isDefault).toBe(true);
    expect(result.current.columns[2].title).toBe('Done');
    expect(result.current.columns[2].isDefault).toBe(true);
  });

  it('should add a task correctly', async () => {
    const { result } = renderHook(() => useTaskContext(), {
      wrapper: TaskProvider,
    });

    await act(async () => {
      result.current.addTask({
        name: 'Test Task',
        description: 'Test Description',
        deadline: '2024-03-20',
        column: '1',
      });
    });

    await waitFor(() => {
      expect(result.current.columns[0].tasks).toHaveLength(1);
      expect(result.current.columns[0].tasks[0].name).toBe('Test Task');
    });
  });

  it('should edit a task correctly', async () => {
    const { result } = renderHook(() => useTaskContext(), {
      wrapper: TaskProvider,
    });

    let taskId: string;

    await act(async () => {
      result.current.addTask({
        name: 'Test Task',
        description: 'Test Description',
        deadline: '2024-03-20',
        column: '1',
      });
    });

    await waitFor(() => {
      taskId = result.current.columns[0].tasks[0].id;
    });

    await act(async () => {
      result.current.editTask({
        id: taskId,
        name: 'Updated Task',
        description: 'Updated Description',
        deadline: '2024-03-21',
        column: '1',
      });
    });

    await waitFor(() => {
      expect(result.current.columns[0].tasks[0].name).toBe('Updated Task');
    });
  });

  it('should move task between columns', async () => {
    const { result } = renderHook(() => useTaskContext(), {
      wrapper: TaskProvider,
    });

    let taskId: string;

    await act(async () => {
      result.current.addTask({
        name: 'Test Task',
        description: 'Test Description',
        deadline: '2024-03-20',
        column: '1',
      });
    });

    await waitFor(() => {
      taskId = result.current.columns[0].tasks[0].id;
    });

    await act(async () => {
      result.current.moveTask(taskId, '2');
    });

    await waitFor(() => {
      expect(result.current.columns[0].tasks).toHaveLength(0);
      expect(result.current.columns[1].tasks).toHaveLength(1);
      expect(result.current.columns[1].tasks[0].id).toBe(taskId);
    });
  });

  it('should add a new column', async () => {
    const { result } = renderHook(() => useTaskContext(), {
      wrapper: TaskProvider,
    });

    await act(async () => {
      result.current.addColumn('New Column');
    });

    await waitFor(() => {
      expect(result.current.columns).toHaveLength(4);
      expect(result.current.columns[3].title).toBe('New Column');
      expect(result.current.columns[3].isDefault).toBe(false);
    });
  });

  it('should not delete default columns', async () => {
    const { result } = renderHook(() => useTaskContext(), {
      wrapper: TaskProvider,
    });

    await expect(async () => {
      await act(async () => {
        result.current.deleteColumn('1');
      });
    }).rejects.toThrow('Cannot delete default column');

    expect(result.current.columns.length).toBe(3);
    expect(result.current.columns[0].title).toBe('To Do');
  });

  it('should delete non-default column', async () => {
    const { result } = renderHook(() => useTaskContext(), {
      wrapper: TaskProvider,
    });

    await act(async () => {
      result.current.addColumn('New Column');
    });

    let newColumnId: string;
    await waitFor(() => {
      newColumnId = result.current.columns[3].id;
    });

    await act(async () => {
      result.current.deleteColumn(newColumnId);
    });

    await waitFor(() => {
      expect(result.current.columns).toHaveLength(3);
    });
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.getItem to throw an error
    localStorage.getItem = jest.fn(() => {
      throw new Error('localStorage error');
    });

    // Render hook and expect it to use default columns
    const { result } = renderHook(() => useTaskContext(), {
      wrapper: TaskProvider,
    });

    // Should fall back to default columns
    expect(result.current.columns).toEqual(defaultColumns);
  });

  it('should persist state to localStorage', async () => {
    // Reset localStorage mock
    localStorage.getItem = jest.fn(() => null);
    localStorage.setItem = jest.fn();

    const { result } = renderHook(() => useTaskContext(), {
      wrapper: TaskProvider,
    });

    await act(async () => {
      result.current.addTask({
        name: 'Test Task',
        description: 'Test Description',
        deadline: '2024-03-20',
        column: '1',
      });
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'taskColumns',
      expect.stringContaining('"isDefault":true')
    );
  });

  it('should load state from localStorage', () => {
    const savedState = [
      { id: '1', title: 'To Do', tasks: [], isDefault: true },
      { id: '2', title: 'In Progress', tasks: [], isDefault: true },
      { id: '3', title: 'Done', tasks: [], isDefault: true },
      { id: '4', title: 'Custom', tasks: [], isDefault: false },
    ];

    localStorage.getItem = jest.fn(() => JSON.stringify(savedState));

    const { result } = renderHook(() => useTaskContext(), {
      wrapper: TaskProvider,
    });

    expect(result.current.columns).toEqual(savedState);
  });

  it('should not allow deleting columns with tasks', async () => {
    const { result } = renderHook(() => useTaskContext(), {
      wrapper: TaskProvider,
    });

    await act(async () => {
      result.current.addColumn('Custom Column');
    });

    let customColumnId: string;
    await waitFor(() => {
      customColumnId = result.current.columns[3].id;
    });

    await act(async () => {
      result.current.addTask({
        name: 'Test Task',
        description: 'Test Description',
        deadline: '2024-03-20',
        column: customColumnId,
      });
    });

    await expect(async () => {
      await act(async () => {
        result.current.deleteColumn(customColumnId);
      });
    }).rejects.toThrow('Cannot delete column with tasks');
  });
});
