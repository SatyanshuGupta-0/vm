import Sidebar from "./Sidebar";
import { RiMenu2Fill } from "react-icons/ri";
import { MdSearch } from "react-icons/md";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ sidevalue }) => {
  const isMobile = window.innerWidth <= 768;
  const [dropDownMyAcc, setDropDownMyAcc] = useState(false);
  const [sidebarMenu, setSidebarMenu] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(isMobile ? "0px" : "48px");
  const [isLogin, setIsLogin] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const navigate = useNavigate();

  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);

  const showMyAcc = () => {
    setDropDownMyAcc((prev) => !prev);
  };

  const showSidebar = () => {
    const isMobile = window.innerWidth <= 768;
    const newWidth = sidebarWidth === "240px" ? (isMobile ? "0px" : "48px") : "240px";
    setSidebarMenu((prev) => !prev);
    setSidebarWidth(newWidth);
  };

  // 👉 Notify parent (AppLayout) of sidebar width changes
  useEffect(() => {
    sidevalue(sidebarWidth);
  }, [sidebarWidth, sidevalue]);

  // 👉 Check login state
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const admin = JSON.parse(localStorage.getItem("adminInfo"));
    if (token) {
      setIsLogin(true);
      if (admin) setAdminData(admin);
    } else {
      setIsLogin(false);
    }
  }, []);

  // 👉 Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    setIsLogin(false);
    navigate("/login");
  };

  // 👉 Detect outside click on mobile to close sidebar and reset navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        sidebarMenu &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setSidebarMenu(false);
        setSidebarWidth("0px"); // collapse navbar
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarMenu, sidebarWidth, isMobile]);

  return (
    <>
      <div className="flex">
        {/* Sidebar */}
        <div ref={sidebarRef}>
          <Sidebar sidebarMenu={sidebarMenu} />
        </div>

        {/* Navbar */}
        <div
          className="h-12 bg-white shadow-bottom flex items-center fixed top-0"
          style={{
            width: `calc(100vw - ${sidebarWidth})`,
            left: sidebarWidth,
            zIndex: 999,
            transition: "all 0.3s ease",
          }}
        >
          <Button
            onClick={showSidebar}
            className="!h-10 !rounded-full ml-4"
            ref={menuButtonRef}
          >
            <RiMenu2Fill className="text-lg" />
          </Button>

          {/* Search bar (optional) */}
          {/* <div className="mx-4 rounded-lg border-2 border-black w-72 flex items-center bg-white h-9">
            <input
              className="focus:outline-none rounded-lg w-64 px-2"
              type="text"
              placeholder="Search here..."
            />
            <div className="bg-black h-6 w-6 rounded-full flex items-center justify-center cursor-pointer">
              <MdSearch className="text-white text-md" />
            </div>
          </div> */}

          {/* Right side icons */}
          <div className="ml-auto flex items-center pr-4">
            <Badge
              badgeContent={1}
              color="success"
              className="mr-4"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <IoIosNotificationsOutline className="text-2xl cursor-pointer" />
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
