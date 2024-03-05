import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Account from "./pages/Account";
import ProtectedRoute from "./routeProtectors/ProtectedRoute";
import "./App.css";
import PublicRoute from "./routeProtectors/PublicRoute";
import AdminRoute from "./routeProtectors/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NavBar from "./pages/components/NavBar";
import Home from "./pages/Home";
import Games from "./pages/Games";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Bingo from "./games/bingo/Bingo";

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
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="games/bingo"
          element={
            <ProtectedRoute>
              <Bingo />
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
