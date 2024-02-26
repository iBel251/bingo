import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Account from "./pages/Account";
import ProtectedRoute from "./routeProtectors/ProtectedRoute";
import "./App.css";
import PublicRoute from "./routeProtectors/PublicRoute";
import AdminRoute from "./routeProtectors/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OtpTest from "./pages/OtpTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/otp" element={<OtpTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
