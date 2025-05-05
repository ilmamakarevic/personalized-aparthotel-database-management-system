import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Owner from './pages/Owner';
import ApartmentDetails from './pages/ApartmentDetails';
import OwnerReport from './pages/OwnerReport';
import AddApartment from './pages/AddApartment';
import EditApartment from './pages/EditApartment';
import HousekeepingTasks from './pages/HousekeepingTasks';
import FrontOffice from './pages/FrontOffice';
import Manager from './pages/Manager';
import BookApartment from './pages/BookApartment';
import CalendarView from './pages/CalendarView';
import Finance from './pages/Finance';

import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import RoleRouter from './components/RoleRouter';

function App() {
  return (
    <Routes>
      {/* 🌐 Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 Dynamic Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleRouter />
          </ProtectedRoute>
        }
      />

      {/* 👑 Owner */}
      <Route
        path="/dashboard/owner"
        element={
          <ProtectedRoute>
            <RoleGuard allowed={['owner']}>
              <Owner />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/apartment/:id"
        element={
          <ProtectedRoute>
            <RoleGuard allowed={['owner', 'manager']}>
              <ApartmentDetails />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/report"
        element={
          <ProtectedRoute>
            <RoleGuard allowed={['owner', 'manager']}>
              <OwnerReport />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* 🛎️ Front Office */}
      <Route
        path="/dashboard/front"
        element={
          <ProtectedRoute>
            <RoleGuard allowed={['front_office']}>
              <FrontOffice />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/bookings"
        element={
          <ProtectedRoute>
            <RoleGuard allowed={['front_office']}>
              <BookApartment />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* 🧹 Housekeeping */}
      <Route
        path="/dashboard/housekeeping"
        element={
          <ProtectedRoute>
            <RoleGuard allowed={['housekeeping']}>
              <HousekeepingTasks />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* 💼 Manager */}
      <Route
        path="/dashboard/manager"
        element={
          <ProtectedRoute>
            <RoleGuard allowed={['manager']}>
              <Manager />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/edit/:id"
        element={
          <ProtectedRoute>
            <RoleGuard allowed={['manager', 'owner']}>
              <EditApartment />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/add"
        element={
          <ProtectedRoute>
            <RoleGuard allowed={['manager', 'owner']}>
              <AddApartment />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/calendar/:id"
        element={
          <ProtectedRoute>
            <RoleGuard allowed={['manager']}>
              <CalendarView />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/finance/:id"
        element={
          <ProtectedRoute>
            <RoleGuard allowed={['manager']}>
              <Finance />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
