# Task Management App

A simple task management application built with React, similar to Jira, Trello, or Basecamp.

## Features

- Add, edit, and delete tasks
- Task details include name, description, deadline, and optional image attachment
- Favorite tasks for quick access
- Sort tasks alphabetically within columns
- Add custom columns for different work states
- Move tasks between columns
- Persistent storage using localStorage
- Fully responsive design

## Technical Stack

- React.js with TypeScript
- Material UI for components
- React Router for navigation
- Jest and React Testing Library for testing
- Local Storage for data persistence

## Getting Started

1. Install dependencies:

```bash
yarn install
```

2. Start the development server:

```bash
yarn dev
```

3. Run tests:

```bash
yarn test
```

4. Build for production:

```bash
yarn build
```

## Project Structure

```
src/
  ├── components/         # React components
  │   ├── TaskBoard.tsx  # Main board component
  │   ├── TaskCard.tsx   # Individual task component
  │   ├── TaskColumn.tsx # Column component
  │   └── TaskForm.tsx   # Task add/edit form
  ├── context/           # React context
  │   └── TaskContext.tsx # Task state management
  ├── types/             # TypeScript types
  │   └── Task.ts        # Task and Column types
  └── __tests__/         # Test files
```

## Features Implemented

- [x] Add new tasks with name, description, and deadline
- [x] Edit existing tasks
- [x] Delete tasks
- [x] Attach images to tasks
- [x] View task details
- [x] Add custom columns
- [x] Move tasks between columns
- [x] Sort tasks by name
- [x] Favorite tasks with priority sorting
- [x] Persistent storage
