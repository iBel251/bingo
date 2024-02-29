import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Account from "./pages/Account";
import ProtectedRoute from "./routeProtectors/ProtectedRoute";
import "./App.css";
import PublicRoute from "./routeProtectors/PublicRoute";
import AdminRoute from "./routeProtectors/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NavBar from "./pages/components/NavBar";

const NavBarWrapper = () => {
  const location = useLocation(); // Use the useLocation hook to get the current location
  // Check the pathname and render NavBar conditionally
  return location.pathname !== "/login" ? <NavBar /> : null;
};

function App() {
  return (
    <BrowserRouter>
      <NavBarWrapper />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
