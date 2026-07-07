import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useState } from "react";

const AppLayout = () => {
  const [sidebarWidth, setSidebarWidth] = useState("240px");

  const handleSidebarToggle = (value) => {
    const isMobile = window.innerWidth <= 768;
    
      setSidebarWidth(!isMobile ? value : "0px"); // Collapse logic
    
  };

  return (
    <>
      <Navbar sidevalue={handleSidebarToggle} />

      <div className="mt-12 overflow-hidden" style={{ marginLeft: sidebarWidth }}>
        <Outlet />
      </div>
    </>
  );
};

export default AppLayout;
