import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'; // <-- Impor

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider> {/* <-- Bungkus di sini */}
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
