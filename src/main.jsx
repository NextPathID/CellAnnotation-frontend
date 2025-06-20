import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { LLMProvider } from './context/LLMContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LLMProvider>
      <App />
    </LLMProvider>
  </StrictMode>
);