import Sidenavbar from "./sidenavbar";
import { RiMenu2Fill } from "react-icons/ri";
import { MdSearch } from "react-icons/md";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottomnavbar from "./bottomnavbar";
import { fetchDataFromApi } from "../utils/api";
import ProductSearch from "./searchengine";

const Navbar = ({ sidevalue }) => {
  const [dropDownMyAcc, setDropDownMyAcc] = useState(false);
  const [sidebarMenu, setSidebarMenu] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState("48px");
  const [islogin, setIslogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Toggle dropdown
  const showMyAcc = () => setDropDownMyAcc((prev) => !prev);

  // Toggle sidebar width
  const showSidebar = () => {
    setSidebarMenu((prev) => !prev);
    setSidebarWidth((prevWidth) => (prevWidth === "240px" ? "48px" : "240px"));
  };

  // Notify parent about sidebar width
  useEffect(() => {
    sidevalue(sidebarWidth);
  }, [sidebarWidth]);

  // Fetch user info
  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token) {
      setIslogin(true);
      fetchUserDetails(token);
    }
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetchDataFromApi("/api/user/user-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // only if your API uses cookies
      });

      if (response.success) {
        setUserInfo(response.data); // Adjust this according to your API response
      }
    } catch (error) {
      console.error("Error fetching user info:", error.response?.data || error.message);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetchDataFromApi("/api/user/logout", {
        withCredentials: true,
      });

      if (response.success) {
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("actionType");

        setIslogin(false);
        navigate("/login");
      } else {
        console.error("Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex">
      <Sidenavbar sidebarMenu={sidebarMenu} />

      <div
        className="h-12 bg-white shadow-bottom flex items-center fixed top-0"
        style={{
          width: `calc(100vw - ${sidebarWidth})`,
          left: sidebarWidth,
          zIndex: 999,
        }}
      >
        <Button onClick={showSidebar} className="!h-10 !rounded-full ml-4">
          <RiMenu2Fill className="text-lg" />
        </Button>

        <img
          className="h-12  pl-1"
          src="/loggo3.png"
          alt="Logo"
        />

        {/* Search bar */}
        <div className="mx-1  w-[900px] flex items-center bg-white h-9 xs:hidden md:flex">
          {/* <input
            className="focus:outline-none rounded-lg w-64 px-2"
            type="text"
            placeholder="Search here..."
            /> */}
          <ProductSearch />
          {/* <div className="bg-black h-6 w-6 rounded-full flex items-center justify-center cursor-pointer">
            <MdSearch className="text-white text-md" />
          </div> */}
        </div>


        {/* Right side buttons */}
        <div className="ml-auto flex items-center pr-4">
          {/* <Badge badgeContent={1} color="success" className="mr-4">
            <IoIosNotificationsOutline className="text-2xl cursor-pointer" />
          </Badge> */}

          {islogin ? (
            <Link to="/profile">
              <div
                onClick={showMyAcc}
                className="h-10 w-10 xs:mr-0 md:mr-3 rounded-full border-2 border-green-700 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                <img
                  src={userInfo?.avatar?.url || "/logo_VM.png"}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>

            </Link>
          ) : (
            <Link to="/login">
              <div className="rounded-2xl h-8 w-14 xs:mr-0 md:mr-3 flex items-center justify-center">
                <p className="text-black hover:drop-shadow-lg hover:underline">Login</p>
              </div>
            </Link>
          )}

          {/* Dropdown menu */}
          {/* {dropDownMyAcc && (
            <div className="absolute top-14 right-7 border-2 border-black w-72 bg-white rounded-lg overflow-hidden z-50">
              <div className="border-b-2 border-black flex m-2">
                <div className="h-8 min-w-8 max-w-8 rounded-full border-2 border-green-700 flex items-center justify-center m-2 overflow-hidden">
                  <img src={userInfo?.avatar || "/VM2_logo-Photoroom.png"} alt="profile" />
                </div>
                <div className="h-9 w-44">
                  <span className="text-md">{userInfo?.name || "User"}</span>
                  <p className="text-sm">{userInfo?.email || "email@example.com"}</p>
                </div>
              </div>

              <div onClick={showMyAcc}>
                <div
                  onClick={handleLogout}
                  className="border-t-2 border-black m-2 flex items-center justify-center text-lg cursor-pointer"
                >
                  <IoMdLogOut className="mx-2" />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>

      <Bottomnavbar />
    </div>
  );
};

export default Navbar;
