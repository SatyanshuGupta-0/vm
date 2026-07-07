import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../utils/api";

// Icon Imports
import { LuLayoutDashboard } from "react-icons/lu";
import { FaAngleDown, FaRegImages, FaBoxOpen } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { TbBrandProducthunt, TbCategory2 } from "react-icons/tb";
import { IoBagCheckOutline, IoCarSportOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";

const Sidebar = ({ sidebarMenu, setSidebarMenu }) => {
  const [sidebarWidth, setSidebarWidth] = useState("48px");
  const [expandedMenu, setExpandedMenu] = useState(null);
  const sidebarRef = useRef(null); // ✅ Reference to sidebar DOM

  const navigate = useNavigate();
  const blockedRoles = ["shopkeeper", "guest"];
  const userRole = localStorage.getItem("name");

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    if (sidebarMenu) {
      setSidebarWidth("240px");
    } else {
      setSidebarWidth(isMobile ? "0px" : "48px");
      setExpandedMenu(null);
    }

    // ✅ Outside click handler
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        sidebarMenu &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarMenu, setSidebarMenu]);

  const toggleSubMenu = (menuIndex) => {
    setExpandedMenu((prev) => (prev === menuIndex ? null : menuIndex));
  };

  const handleLogout = async () => {
    try {
      await fetchDataFromApi("/api/admin/logout");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("refreshtoken");
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItem = (to, icon, label) => (
    <Link to={to}>
      <Button className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold">
        {icon}
        <span className="text-md">{label}</span>
      </Button>
    </Link>
  );

  const dropdownMenu = (index, icon, label, subRoutes) => (
    <>
      <Button
        onClick={() => toggleSubMenu(index)}
        className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold"
      >
        {icon}
        <span className="text-md">{label}</span>
        <FaAngleDown className="ml-auto mr-3" />
      </Button>
      {expandedMenu === index && (
        <ul className="block">
          {subRoutes.map(({ to, label }, i) => (
            <li key={i} className="hover:bg-[rgb(246,247,255)] w-52 mr-1">
              <Link to={to}>
                <Button className="!text-black !capitalize !w-52 !text-opacity-60 text-sm text-left ml-3">
                  {label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <>
      <div className="sidebar" ref={sidebarRef}>
        {/* Header */}
        <div
          className="h-12 fixed flex items-center bg-white shadow-bottom z-50"
          style={{ width: sidebarWidth }}
        >
          <img className="h-4 pl-1 " src="/logo_VM.png" alt="Logo" />
          {sidebarMenu && <h1 className="ml-2 font-bold text-lg">VM</h1>}
        </div>

        {/* Sidebar Content */}
        <div
          className="overflow-y-auto fixed top-12 h-[calc(100vh-48px)] shadow-right bg-white z-40"
          style={{ width: sidebarWidth }}
        >
          <div className="h-full relative">
            {menuItem("/", <LuLayoutDashboard className="text-xl" />, "Dashboard")}

            {!blockedRoles.includes(userRole) &&
              dropdownMenu(1, <FaRegImages className="text-xl" />, "Home Slides", [
                { to: "/", label: "Home Banner List" },
                { to: "/banner", label: "Add Home Banner Slide" },
              ])}

            {!blockedRoles.includes(userRole) &&
              menuItem("/User", <FiUsers className="text-xl" />, "Users")}

            {dropdownMenu(2, <TbBrandProducthunt className="text-xl" />, "Products", [
              { to: "/Product", label: "Product List" },
              { to: "/Product/Add", label: "Product Upload" },
            ])}

            {!blockedRoles.includes(userRole) &&
              dropdownMenu(3, <IoCarSportOutline className="text-xl" />, "Car Model", [
                { to: "/carModelUpdate", label: "CarModelUpdate" },
                { to: "/carModelUpload", label: "CarModelUpload" },
              ])}

            {!blockedRoles.includes(userRole) &&
              dropdownMenu(4, <TbCategory2 className="text-xl" />, "Category", [
                { to: "/category-list", label: "Category List" },
                { to: "/add-category", label: "Add A Category" },
                { to: "/subcategory-list", label: "Sub Category List" },
                { to: "/add-subcategory", label: "Add A Sub Category" },
              ])}

            {menuItem("/Order", <FaBoxOpen className="text-xl" />, "Orders")}

            {!blockedRoles.includes(userRole) &&
              menuItem("/register", <IoBagCheckOutline className="text-xl" />, "Register")}

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold"
            >
              <IoMdLogOut className="text-xl" />
              <span className="text-md">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
