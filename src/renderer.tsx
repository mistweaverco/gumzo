import React from 'react'
import { createRoot } from 'react-dom/client'

import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bulma/css/bulma.min.css'
import './index.css'
import Navigation from './components/Navigation'

const rootNode = document.getElementById('root') as HTMLElement

createRoot(rootNode).render(
  <React.StrictMode>
    <Navigation />
  </React.StrictMode>,
)
