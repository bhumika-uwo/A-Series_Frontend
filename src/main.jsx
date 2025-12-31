import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './Components/Toast/ToastContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
<<<<<<< HEAD
    <App />
=======

    <ToastProvider>
      <App />
    </ToastProvider>
>>>>>>> cbe4033bd645362cf73e7c95ce204b47682a9828
  </StrictMode>,
)
