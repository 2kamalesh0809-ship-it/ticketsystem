import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import Customers from './pages/Customers';
import CustomerProfile from './pages/CustomerProfile';
import CallLogs from './pages/CallLogs';
import Reports from './pages/Reports';
import AuditReport from './pages/AuditReport';
import SupportMemberView from './pages/AgentView';
import Profile from './pages/Profile';
import './index.css';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};


const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes Wrapper */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="tickets/create" element={<CreateTicket />} />
          <Route path="tickets/:id" element={<TicketDetails />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerProfile />} />
          <Route path="call-logs" element={<CallLogs />} />
          <Route path="reports" element={<Reports />} />
          <Route path="audit-report" element={<AuditReport />} />
          <Route path="agent-view" element={<SupportMemberView />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
