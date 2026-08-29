import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- NEW IMPORT
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the App component to enable routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)