import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { TicketProvider } from './context/TicketContext'
import { CustomerProvider } from './context/CustomerContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TicketProvider>
        <CustomerProvider>
          <App />
        </CustomerProvider>
      </TicketProvider>
    </AuthProvider>
  </React.StrictMode>,
)
