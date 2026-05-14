import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import { Role } from "./types";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import AssetManagement from "./pages/admin/AssetManagement";
import OrderAssets from "./pages/commander/OrderAssets";
import OrderTracking from "./pages/commander/OrderTracking";
import OrderManagement from "./pages/logistics/OrderManagement";
import ShippingUpdates from "./pages/logistics/ShippingUpdates";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Common Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/assets"
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <AssetManagement />
                </ProtectedRoute>
              }
            />

            {/* Base Commander Routes */}
            <Route
              path="/commander/order"
              element={
                <ProtectedRoute allowedRoles={[Role.BASE_COMMANDER]}>
                  <OrderAssets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/commander/tracking"
              element={
                <ProtectedRoute allowedRoles={[Role.BASE_COMMANDER]}>
                  <OrderTracking />
                </ProtectedRoute>
              }
            />

            {/* Logistics Officer Routes */}
            <Route
              path="/logistics/orders"
              element={
                <ProtectedRoute allowedRoles={[Role.LOGISTICS_OFFICER]}>
                  <OrderManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logistics/shipping"
              element={
                <ProtectedRoute allowedRoles={[Role.LOGISTICS_OFFICER]}>
                  <ShippingUpdates />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
