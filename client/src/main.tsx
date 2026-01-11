import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.tsx'

const container = document.getElementById('root');

if (!container) {
  throw new Error("Failed to find the root element. Make sure index.html has a <div id='root'></div>");
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
