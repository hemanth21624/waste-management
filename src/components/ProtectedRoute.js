// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  if (!user) {
    // remember where user wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
