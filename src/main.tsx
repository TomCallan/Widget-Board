import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SettingsProvider } from './contexts/SettingsContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { StorageModeProvider } from './contexts/StorageModeContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <StorageModeProvider>
        <SettingsProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </SettingsProvider>
      </StorageModeProvider>
    </AuthProvider>
  </React.StrictMode>
);
