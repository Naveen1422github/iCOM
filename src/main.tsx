import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './app.css'

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <div className='apps'>
      
    <App />
    </div>
  </React.StrictMode>
);