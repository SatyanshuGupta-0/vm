import { Button } from "@mui/material";
import { useEffect, useState, forwardRef } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlinePhone, MdOutlinePeopleAlt, MdOutlineAccountCircle } from "react-icons/md";
import { IoMdLogOut, IoMdLogIn } from "react-icons/io";
import { IoBagHandleOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { GiArchiveRegister } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../utils/api";

const Phonesidebar = forwardRef(({ sidebarMenu, setSidebarMenu }, ref) => {
  const [widthbar, setWidthbar] = useState("0px");
  const [listbar, setlistbar] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    setIsLoggedIn(!!token);
  }, [sidebarMenu]);

  useEffect(() => {
    if (sidebarMenu) {
      setWidthbar("0px");
    } else {
      setWidthbar("240px");
      setlistbar(0);
    }
  }, [sidebarMenu]);

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarMenu(true);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accesstoken");
      const response = await fetchDataFromApi("/api/user/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success) {
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        localStorage.removeItem("selectedCar");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("actionType");

        handleNavigation("/login");
      } else {
        console.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div
      ref={ref}
      className="block overflow-y-auto overflow-x-hidden shadow-right fixed top-12 h-[calc(100vh-48px)]"
      style={{
        width: widthbar,
        zIndex: 999,
        transition: "width 0.5s ease",
      }}
    >
      <div className="h-full bg-white flex flex-col justify-between pb-10">
        <div>
          <Button
            onClick={() => handleNavigation("/")}
            className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold"
          >
            <LuLayoutDashboard className="text-xl" />
            <span className="text-md">Home</span>
          </Button>

          <Button
            onClick={() => handleNavigation("/about")}
            className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold"
          >
            <MdOutlinePeopleAlt className="text-xl" />
            <span className="text-md">About Us</span>
          </Button>

          <Button
            onClick={() => handleNavigation("/contact")}
            className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold"
          >
            <MdOutlinePhone className="text-xl" />
            <span className="text-md">Contact</span>
          </Button>

          <Button
            onClick={() => handleNavigation("/searching")}
            className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold"
          >
            <CiFilter className="text-xl" />
            <span className="text-md">Filter</span>
          </Button>

          <Button
            onClick={() => handleNavigation("/Order")}
            className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold"
          >
            <IoBagHandleOutline className="text-xl" />
            <span className="text-md">My Orders</span>
          </Button>

          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold"
            >
              <IoMdLogOut className="text-xl" />
              <span className="text-md">Logout</span>
            </Button>
          ) : (
            <>
              <Button
                onClick={() => handleNavigation("/login")}
                className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold"
              >
                <IoMdLogIn className="text-xl" />
                <span className="text-md">Login</span>
              </Button>

              <Button
                onClick={() => handleNavigation("/signup")}
                className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold"
              >
                <GiArchiveRegister className="text-xl" />
                <span className="text-md">Register</span>
              </Button>
            </>
          )}
        </div>

        <div className="mb-2">
          <Button
            onClick={() => handleNavigation("/profile")}
            className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold"
          >
            <MdOutlineAccountCircle className="text-xl" />
            <span className="text-md">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default Phonesidebar;
