import React, { useContext } from "react";
import "./layout.scss";
import Navbar from "../../components/narvar/navbar";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
const Layout = () => {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};
const RequireAuth = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export { Layout, RequireAuth };
