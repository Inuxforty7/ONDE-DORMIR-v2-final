import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Defensive filter for Vite dev HMR websocket disconnects in sandbox iframes
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const errorMsg = event?.reason?.message || (typeof event?.reason === 'string' ? event.reason : '');
    if (errorMsg.includes('WebSocket') || errorMsg.includes('websocket')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
