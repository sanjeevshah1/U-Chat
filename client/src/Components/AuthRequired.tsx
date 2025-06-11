import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
const AuthRequired = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuthStore();
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{
          message: "Oops, You must login First.",
          path: location.pathname,
        }}
        replace
      />
    );
  }
  return <Outlet />;
};

export default AuthRequired;
