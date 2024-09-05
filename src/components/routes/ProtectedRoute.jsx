import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { isUserAuthenticated } from "../../guards/auth-guard";

const ProtectedRoute = ({ redirectRoute = "", queryParam = "" }) => {
  const auth = isUserAuthenticated();

  return auth ? (
    <Outlet />
  ) : (
    <Navigate replace to={redirectRoute + queryParam} />
  );
};

export default ProtectedRoute;
