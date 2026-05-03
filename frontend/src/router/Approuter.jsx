import React from "react";
import { createBrowserRouter, Router } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "../App";
import AuthLayout from "../layout/AuthLayout";
import Home from "../pages/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import ProtectedRoute from "../components/ProtectdRoute";
import DonateBlood from "../pages/user/DonatebBlood";
import BloodBanks from "../pages/user/BloodBanksNearby";
import About from "../pages/user/About";
import ForgotPassword from "../components/ForgetPass";
import ResetPassword from "../components/UpdatePass";
import GoogleAuthSuccess from "../components/GoogleAuthSuccess";
import MultiStepForm from "../components/MultiStepForm";
const Approuter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true, // This makes Home the default view for "/"
          element: <Home />,
        },
        {
          path: "/donateBlood",
          element: <DonateBlood />,
        },
        {
          path: "/bloodBanks",
          element: <BloodBanks />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/login",
          element: <AuthLayout />,
        },
        {
          path: "/login/forget-pass",
          element: <ForgotPassword />,
        },
        {
          path: "/login/reset-pass/:token",
          element: <ResetPassword />,
        },
        {
          path: "/google-auth-success/:token",
          element: <GoogleAuthSuccess/>,
        },
        {
          path: "/bloodbank/details/form",
          element: <MultiStepForm/>
        }
      ],
    },
    {
      path: "/manage-blood-bank",
      element: (
        <ProtectedRoute allowedRole="manage_bank">
          <OwnerDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/dashboard",
      element: (
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Approuter;
