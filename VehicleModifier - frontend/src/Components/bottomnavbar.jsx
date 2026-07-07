import { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { MdAccountCircle, Md3dRotation } from "react-icons/md";
import { Link } from "react-router-dom";
import {fetchDataFromApi} from "../utils/api"; // Make sure this is your API helper

const Bottomnavbar = () => {
  const [isSiteClosed, setIsSiteClosed] = useState(false);

  useEffect(() => {
    const checkSiteStatus = async () => {
      try {
        const res = await fetchDataFromApi("/api/toggle/toggle");
        setIsSiteClosed(res.isClosed);
      } catch (err) {
        console.error("Failed to fetch toggle state:", err);
      }
    };
    checkSiteStatus();
  }, []);

  return (
    <div
      className="h-12 w-full md:hidden bg-white text-lg fixed bottom-0 grid grid-cols-5 items-center justify-center shadow-lg shadow-black drop-shadow-md rounded-t-xl overflow-visible"
      style={{ zIndex: 999 }}
    >
      <Link to="/">
        <FaHome className="justify-self-center" />
      </Link>
      <Link to="/wishlist">
      <FaHeart className="justify-self-center" />
      </Link>

      <div className="justify-self-center rounded-full overflow-visible">
        {!isSiteClosed ? (
          <Link to="/3D">
            <div className="bg-white rounded-full shadow-md shadow-black relative bottom-3 h-10 w-10 justify-self-center flex items-center justify-center mb-1">
              <Md3dRotation className="justify-self-center text-2xl" />
            </div>
          </Link>
        ) : (
          <div
            className="bg-gray-300 rounded-full relative bottom-3 h-10 w-10 justify-self-center flex items-center justify-center mb-1 cursor-not-allowed opacity-50"
            title="3D view is currently disabled"

          >
          <Link to="/">
            VM
          </Link>
            {/* <Md3dRotation className="text-2xl" /> */}
          </div>
        )}
      </div>
<Link to="/contact">
      <IoCall className="justify-self-center" />
</Link>
      <Link to="/profile">
        <MdAccountCircle className="justify-self-center" />
      </Link>
    </div>
  );
};

export default Bottomnavbar;
