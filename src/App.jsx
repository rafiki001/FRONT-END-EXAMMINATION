import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Requisitions from './pages/Requisitions.jsx';
import CreateRequisition from './pages/CreateRequisition.jsx';
import RequisitionDetails from './pages/RequisitionDetails.jsx';
import InventoryItems from './pages/InventoryItems.jsx';
import Reports from './pages/Reports.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/requisitions" element={<Requisitions />} />
                <Route path="/requisitions/new" element={<CreateRequisition />} />
                <Route path="/requisitions/:requisitionId/edit" element={<CreateRequisition />} />
                <Route path="/requisitions/:requisitionId" element={<RequisitionDetails />} />
                <Route path="/inventory" element={<InventoryItems />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
