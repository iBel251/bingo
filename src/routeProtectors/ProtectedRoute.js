import React from "react";
import { Navigate } from "react-router-dom";
import useMainStore from "../store/mainStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentUser } = useMainStore(); // Assuming this is implemented
  const isAdmin = currentUser?.isAdmin || false;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
