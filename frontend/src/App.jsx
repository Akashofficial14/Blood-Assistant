import React from "react";
import { ToastContainer, toast } from "react-toastify";
import UserDashboard from "./pages/user/UserDashboard";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Chatbot from "./components/ChatBot";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const App = () => {
  return (
    <div className="min-h-screen max-w-screen bg-[#FFFDFD]">
      <UserDashboard />
      <ToastContainer />
      <Chatbot/>
    </div>
  );
};

export default App;
