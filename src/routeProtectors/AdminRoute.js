import React from "react";
import { Navigate } from "react-router-dom";
import useMainStore from "../store/mainStore"; // Adjust the path as necessary

const AdminRoute = ({ children }) => {
  const { isAuthenticated, currentUser } = useMainStore();
  const isAdmin = currentUser?.isAdmin || false;
  if (!isAuthenticated) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    // User is not an admin, redirect to a default page, e.g., home page
    return <Navigate to="/" />;
  }

  return children; // User is an admin, render the protected component
};

export default AdminRoute;
