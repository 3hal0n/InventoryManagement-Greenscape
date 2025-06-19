import './App.css';
import InventoryHome from "./component/InventoryHome/InventoryHome";
import InventoryNav from './component/InventoryNav/InventoryNav';
import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import LowStockAlerts from "./component/LowStockAlerts/LowStockAlerts";
import MaintenanceLogs from "./component/MaintenanceLogs/MaintenanceLogs";
import StockTracking from "./component/StockTracking/StockTracking";
import UsageReports from "./component/UsageReports/UsageReports";
import InventoryDetails from "./component/InventoryDetails/InventoryDetails";
import AddInventory from "./component/AddInventory/AddInventory";
import UpdateInventory from './component/UpdateInventory/UpdateInventory';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './component/Auth/ProtectedRoute';
import Login from './component/Auth/Login';
import Register from './component/Auth/Register';
import NotificationCenter from './component/Notifications/NotificationCenter';

import Dashboard from './component/Dashboard/Dashboard';
import Unauthorized from './component/Auth/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <div className="app">
      
        <NotificationCenter />
        <div className="content">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Inventory Management Routes */}
            <Route path="/InventoryDetails" element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <InventoryDetails />
              </ProtectedRoute>
            } />

            <Route path="/LowStockAlerts" element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <LowStockAlerts />
              </ProtectedRoute>
            } />

            <Route path="/MaintenanceLogs" element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <MaintenanceLogs />
              </ProtectedRoute>
            } />

            <Route path="/UsageReports" element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'employee']}>
                <UsageReports />
              </ProtectedRoute>
            } />

            <Route path="/AddInventory" element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <AddInventory />
              </ProtectedRoute>
            } />

            <Route path="/update-inventory/:InventoryId" element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <UpdateInventory />
              </ProtectedRoute>
            } />

            {/* Legacy routes - redirect to new routes */}
            <Route path="/inventory" element={<Navigate to="/InventoryDetails" replace />} />
            <Route path="/usage-report" element={<Navigate to="/UsageReports" replace />} />
            <Route path="/maintenance-report" element={<Navigate to="/MaintenanceLogs" replace />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
