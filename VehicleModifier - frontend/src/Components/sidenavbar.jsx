import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaAngleDown, FaRegImages } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { TbBrandProducthunt, TbCategory2 } from "react-icons/tb";
import { IoBagCheckOutline, IoBagHandleOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { CiFilter } from "react-icons/ci";
import { MdOutlineAccountCircle } from "react-icons/md";
import { fetchDataFromApi } from "../utils/api";
import { MdOutlinePhone } from "react-icons/md";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoMdLogIn } from "react-icons/io";
import { GiArchiveRegister } from "react-icons/gi";


const Sidenavbar = ({ sidebarMenu }) => {
    const [widthbar, setWidthbar] = useState("240px");
    const [listbar, setlistbar] = useState(0);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accesstoken");
        setIsLoggedIn(!!token);
    }, [sidebarMenu]); // Optional: rerun when sidebarMenu changes


    useEffect(() => {
        if (sidebarMenu) {
            setWidthbar("48px");
            setlistbar(0);
        } else {
            setWidthbar("240px");
        }
    }, [sidebarMenu]);

    const showlist = (value) => {
        if (widthbar !== "48px") {
            setlistbar((prev) => (prev === value ? null : value));
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetchDataFromApi("/api/user/logout", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

           
            if (response.success) {
                localStorage.removeItem("accesstoken");
                localStorage.removeItem("refreshtoken");
                localStorage.removeItem("selectedCar");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("actionType");

                navigate("/login");
            } else {
                console.error("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <>
        <div style={{ zIndex: 999 }}>
            {/* Header Logo */}
            <div
                className={`h-12 fixed flex items-center bg-white shadow-bottom z-50`}
                style={{ width: widthbar }}
            >
                {/* <img
                    className="h-6 w-9 pl-1"
                    src="/VM_logo3.png"
                    alt="Logo"
                /> */}
                {/* {!sidebarMenu && <h1 className="ml-2">VM</h1>} */}
            </div>

            {/* Sidebar */}
            <div
                className="block overflow-y-auto overflow-x-hidden shadow-right fixed top-12 h-[calc(100vh-48px)]"
                style={{ width: widthbar }}
            >
                <div className="h-full bg-white flex flex-col justify-between">
                    {/* Top section */}
                    <div>
                        <Link to="/">
                            <Button className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold">
                                <LuLayoutDashboard className="text-xl" />
                                <span className="text-md">Home</span>
                            </Button>
                        </Link>

                        {/* Category */}
                        {/* <Button
                            onClick={() => showlist(3)}
                            className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold"
                        >
                            <TbCategory2 className="text-xl" />
                            <span className="text-md">Category</span>
                            <FaAngleDown className="ml-auto mr-3" />
                        </Button>

                        {listbar === 3 && (
                            <ul className="block">
                                <li className="hover:bg-[rgb(246,247,255)] w-52 mr-1">
                                    <Button className="!text-black !capitalize !w-52 !text-opacity-60">
                                        <span className="p-1 ml-3 text-sm">Category List</span>
                                    </Button>
                                </li>
                                <li className="hover:bg-[rgb(246,247,255)] w-52 mr-1">
                                    <Button className="!text-black !capitalize !w-52 !text-opacity-60">
                                        <span className="p-1 ml-3 text-sm">Add A Category</span>
                                    </Button>
                                </li>
                                <li className="hover:bg-[rgb(246,247,255)] w-52 mr-1">
                                    <Button className="!text-black !capitalize !w-52 !text-opacity-60">
                                        <span className="p-1 ml-3 text-sm">Sub Category List</span>
                                    </Button>
                                </li>
                                <li className="hover:bg-[rgb(246,247,255)] w-52 mr-1">
                                    <Button className="!text-black !capitalize !w-52 !text-opacity-60">
                                        <span className="p-1 ml-3 text-sm">Add A Sub Category</span>
                                    </Button>
                                </li>
                            </ul>
                        )} */}

                        {/* Filter Button */}
                        <Link to="/about">
                            <Button className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold">
                                <MdOutlinePeopleAlt className="text-xl" />
                                <span className="text-md">About Us</span>
                            </Button>
                        </Link>
                        <Link to="/contact">
                            <Button className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold">
                                <MdOutlinePhone className="text-xl" />
                                <span className="text-md">Contact</span>
                            </Button>
                        </Link>
                        <Link to="/searching">
                            <Button className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold">
                                <CiFilter className="text-xl" />
                                <span className="text-md">Filter</span>
                            </Button>
                        </Link>

                        <Link to="/Order">
                            <Button className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold">
                                <IoBagHandleOutline className="text-xl" />
                                <span className="text-md">My Orders</span>
                            </Button>
                        </Link>
                        {/* Logout Button */}
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
                                <Link to="/login">
                                    <Button className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold">
                                        <IoMdLogIn className="text-xl " />
                                        <span className="text-md">Login</span>
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold">
                                        <GiArchiveRegister className="text-xl " />
                                        <span className="text-md">Register</span>
                                    </Button>
                                </Link>
                            </>
                        )}

                    </div>

                    {/* Bottom section (floated) */}
                    <div className="mb-2">

                        <Link to="/profile">
                            <Button className="!text-black w-56 !justify-start !capitalize gap-3 !m-1 !p-3 font-bold">
                                <MdOutlineAccountCircle className="text-xl" />
                                <span className="text-md">Profile</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default Sidenavbar;
