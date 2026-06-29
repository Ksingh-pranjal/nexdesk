import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminTickets from './pages/admin/AdminTickets';
import AdminClients from './pages/admin/AdminClients';
import AdminEngineers from './pages/admin/AdminEngineers';
import AdminContracts from './pages/admin/AdminContracts';
import AdminReports from './pages/admin/AdminReports';
import AdminTicketDetail from './pages/admin/AdminTicketDetail';
import ClientLayout from './components/ClientLayout';
import ClientTickets from './pages/client/ClientTickets';
import ClientTicketDetail from './pages/client/ClientTicketDetail';
import ClientContracts from './pages/client/ClientContracts';
import EngineerLayout from './components/EngineerLayout';
import EngineerTickets from './pages/engineer/EngineerTickets';
import EngineerTicketDetail from './pages/engineer/EngineerTicketDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Admin routes — closed properly with its own </Route> */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminTickets />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="engineers" element={<AdminEngineers />} />
            <Route path="contracts" element={<AdminContracts />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="tickets/:id" element={<AdminTicketDetail />} />
          </Route>

          {/* Client routes — now a SIBLING of /admin, not nested inside it */}
          <Route
            path="/client"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ClientTickets />} />
            <Route path="tickets/:id" element={<ClientTicketDetail />} />
            <Route path="contracts" element={<ClientContracts />} />
          </Route>

          <Route
            path="/engineer"
            element={
              <ProtectedRoute allowedRoles={['engineer']}>
                <EngineerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<EngineerTickets />} />
            <Route path="tickets/:id" element={<EngineerTicketDetail />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;