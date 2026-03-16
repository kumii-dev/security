import React from 'react';
import ReactDOM from 'react-dom/client';
import { MsalProvider } from '@azure/msal-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { msalInstance } from './config/msalConfig';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e3a8a',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '8px',
            },
            success: {
              style: { background: '#047857', color: '#fff' },
            },
            error: {
              style: { background: '#dc2626', color: '#fff' },
            },
          }}
        />
      </QueryClientProvider>
    </MsalProvider>
  </React.StrictMode>
);
