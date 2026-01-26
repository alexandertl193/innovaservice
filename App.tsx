import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ClientLayout, AdminLayout } from './components/Layouts';
import { LandingPage, SuccessPage, TrackingPage } from './views/ClientViews';
import { ClientWizard } from './views/ClientWizard';
import { AdminDashboard } from './views/AdminDashboard';
import { AdminCaseList, AdminCaseDetail } from './views/AdminCases';

// Layout Wrappers
const ClientRoot = () => (
  <ClientLayout>
    <Outlet />
  </ClientLayout>
);

const AdminRoot = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Client Routes */}
        <Route element={<ClientRoot />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/wizard" element={<ClientWizard />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoot />}>
          <Route index element={<AdminDashboard />} />
          <Route path="cases" element={<AdminCaseList />} />
          <Route path="cases/:id" element={<AdminCaseDetail />} />
          <Route path="schedule" element={<div className="p-8">Agenda en construcción...</div>} />
          <Route path="settings" element={<div className="p-8">Configuración en construcción...</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;