import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-3/4">
        {/* Navbar */}
        <Navbar />

        {/* Dashboard Content */}
        <div className="flex justify-center items-center h-full bg-white">
          <img src="/path-to-your-logo.png" alt="TableSprint" className="w-32 mb-4" />
          <h2 className="text-2xl font-semibold">Welcome to TableSprint admin</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
