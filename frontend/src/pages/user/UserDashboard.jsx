import React from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../../components/Navbar";

const UserDashboard = () => {
  const location = useLocation();
  return (
    <div className="h-full w-full ">
      {location.pathname === "/bloodbank/details/form" ? "" : <Navbar />}
      {/* <Home/> */}
      <Outlet />
    </div>
  );
};

export default UserDashboard;
