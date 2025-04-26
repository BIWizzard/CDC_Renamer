// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import ErrorBoundary from './components/ErrorBoundary';
import { logger } from './services/LoggerService';
import '../styles/tailwind.css';
import '../styles/custom.css';
import '../styles/animations.css';
import '../styles/theme.css';

// Log application startup
logger.info('Application starting up');

// Custom error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  logger.error('Uncaught error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

// Custom error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection:', {
    reason: event.reason,
    stack: event.reason?.stack
  });
});

// Render the application with error boundary
ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);