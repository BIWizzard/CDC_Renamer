// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import '../styles/tailwind.css';
import '../styles/custom.css'; // Add this line to import custom CSS

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);