// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import '../styles/tailwind.css';
import '../styles/custom.css';
import '../styles/animations.css'; // Add animations CSS
import '../styles/theme.css'; // Add theme CSS

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);