import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { TaskProvider } from './context/TaskContext';
import { TaskBoard } from './components/TaskBoard';
import './styles/main.scss';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <TaskProvider>
          <TaskBoard />
        </TaskProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
