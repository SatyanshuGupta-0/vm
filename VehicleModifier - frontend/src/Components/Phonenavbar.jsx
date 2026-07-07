import { RiMenu2Fill } from "react-icons/ri";
import { MdSearch } from "react-icons/md";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Phonesidebar from "./PhoneSidebar";
import Bottomnavbar from "./bottomnavbar";
import { IoCartOutline } from "react-icons/io5";
import { fetchDataFromApi } from "../utils/api";

const Phonenavbar = () => {
  const [sidebarMenu, setSidebarMenu] = useState(true); // true = closed
  const [islogin, setIslogin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null); // Ref for toggle button

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    setIslogin(!!token);
  }, []);

  const toggleSidebar = () => {
    setSidebarMenu((prev) => !prev);
  };

    const getCartCount = async () => {
      try {
        const res = await fetchDataFromApi("/api/cart/get");
        const cartItems = res.data || [];
        // Count total quantity
        
        setCartCount(cartItems.length);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    getCartCount();


  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        localStorage.clear();
        setIslogin(false);
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close sidebar on outside click (ignoring toggle button)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !sidebarMenu &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(e.target)
      ) {
        setSidebarMenu(true); // close sidebar
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarMenu]);

  return (
    <div className="flex flex-col">
      {/* Sidebar */}
      <Phonesidebar
        sidebarMenu={sidebarMenu}
        setSidebarMenu={setSidebarMenu}
        ref={sidebarRef}
      />

      {/* Top Navbar */}
      <div className="fixed top-0 left-0 w-full h-12 bg-white shadow-md flex items-center z-[999]">
        <Button
          onClick={toggleSidebar}
          className="!h-10 !rounded-full ml-4"
          ref={toggleButtonRef}
        >
          <RiMenu2Fill className="text-lg" />
        </Button>

        <img src="/loggo3.png" alt="Logo" className="h-12 pl-2" />

        {/* Search Bar (desktop only) */}
        <div className="mx-4 border-2 border-black w-72 rounded-lg h-9 hidden md:flex items-center bg-white">
          <input
            type="text"
            placeholder="Search here..."
            className="w-64 px-2 rounded-lg focus:outline-none"
          />
          <div className="bg-black h-6 w-6 flex items-center justify-center rounded-full cursor-pointer">
            <MdSearch className="text-white text-sm" />
          </div>
        </div>

        {/* Right icons */}
        <div className="ml-auto flex items-center pr-4">
          <Badge
            badgeContent={0}
            color="success"
            className="mr-4"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {/* <IoIosNotificationsOutline className="text-2xl cursor-pointer" /> */}
          </Badge>

          {islogin && (
            <Link to="/cart">
              <Badge
                badgeContent={cartCount}
                color="secondary"
                className="mr-4"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <IoCartOutline className="text-2xl cursor-pointer" />
              </Badge>
            </Link>
          )}

          {!islogin && (
            <Link to="/login">
              <div className=" rounded-2xl h-8 w-14 flex items-center justify-center">
                <p className="text-black text-sm hover:drop-shadow-md">Login</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <Bottomnavbar />
    </div>
  );
};

export default Phonenavbar;
