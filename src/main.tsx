import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/app/app'
import { R2iProvider } from './components/context/contex'

ReactDOM.render(
  <React.StrictMode>
    <R2iProvider>
      <App />
    </R2iProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
