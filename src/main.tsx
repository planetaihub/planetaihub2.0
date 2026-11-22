import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV && 'caches' in window) {
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key === 'workatlas-static-v1' || key === 'workatlas-static-v2'
            )
            .map((key) => caches.delete(key))
        )
      )
      .catch(() => {});
  }

  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      registration.update().catch(() => {});
    })
    .catch(() => {
      // Service worker registration skipped or blocked in private/unsupported context
    });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
