// src/layouts/DashboardLayout.jsx
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <Navbar />
      {/* Add padding-top roughly equal to navbar height (e.g., 16 * 4 = 64px) */}
      <main className="pt-16 px-4">  {/* pt-16 = 64px padding top */}
        <Outlet />
      </main>
    </div>
  );
};


export default DashboardLayout;
