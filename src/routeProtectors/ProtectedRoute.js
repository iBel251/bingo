import React from "react";
import { Navigate } from "react-router-dom";
import useMainStore from "../store/mainStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentUser } = useMainStore(); // Assuming this is implemented
  const isAdmin = currentUser?.isAdmin || false;
  if (isAdmin) {
    return <Navigate to="/admin" />;
  }
  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they log in, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
