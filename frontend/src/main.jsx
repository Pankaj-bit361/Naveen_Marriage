import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { GalleryProvider } from './contexts/GalleryContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <GalleryProvider>
          <App />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#059669',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#DC2626',
                },
              },
            }}
          />
        </GalleryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);