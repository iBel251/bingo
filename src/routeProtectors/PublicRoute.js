// PublicRoute.js
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useMainStore from "../store/mainStore"; // Adjust path as necessary

const PublicRoute = ({ children }) => {
  const { isAuthenticated, headTo, currentUser } = useMainStore();

  if (isAuthenticated) {
    // Redirect authenticated users to the main page or dashboard

    return <Navigate to={headTo || "/"} />;
  }

  return children;
};

export default PublicRoute;
