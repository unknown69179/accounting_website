import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Linker } from './linker.jsx'
import { Pager } from './pager.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Linker>
    <Pager>
    <App />
    </Pager>
    </Linker>
  </StrictMode>,
)
