// PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import useMainStore from "../store/mainStore"; // Adjust path as necessary

const PublicRoute = ({ children }) => {
  const isAuthenticated = useMainStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    // Redirect authenticated users to the main page or dashboard
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
