import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import './uiverse.css';

/**
 * Entry point de React
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
