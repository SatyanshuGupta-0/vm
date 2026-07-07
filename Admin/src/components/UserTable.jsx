import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../utils/api"
import { RiEdit2Line } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoTrashOutline, IoSearchOutline } from "react-icons/io5";

const USERS_PER_PAGE = 6;

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blockedRoles = ["shopkeeper", "guest"];
  const userRole = localStorage.getItem("name");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchDataFromApi("/api/user/getuser");
        setUsers(res.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile?.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  if (!blockedRoles.includes(userRole)) {
    return (
      <div className="m-3 border-2 border-black border-opacity-10 rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap p-3">
          <h3 className="text-lg font-semibold">Users</h3>
          {/* Search Bar */}
          <div className="flex items-center">
            <div className="rounded-full h-10 w-80 border-2 border-black flex items-center px-2">
              <input
                className="h-8 w-72 px-2 rounded-full focus:outline-none"
                type="text"
                placeholder="Search User..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to page 1 on search
                }}
              />
              {/* <div className="bg-black h-8 w-8 rounded-full flex items-center justify-center text-white">
                <IoSearchOutline />
              </div> */}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="relative mx-3 mb-3 overflow-x-auto shadow-md sm:rounded-lg border-2 border-black border-opacity-10">
          <table className="w-full text-sm text-left text-black">
            <thead className="text-xs uppercase bg-[#f1f1f1]">
              <tr>
                <th className="p-4">
                  <span className="text-sm font-medium">
                    Total: {filteredUsers.length}
                  </span>
                </th>
                <th className="px-6 py-3">User Image</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone No</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr key={user._id || index} className="bg-white border-b-2 border-gray-300">
                    <td className="p-4">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                    <td className="px-6 py-4">
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={user.avatar?.url || "/default-avatar.png"}
                        alt={user.name || "User"}
                      />
                    </td>
                    <td className="px-6 py-4">{user.name || "N/A"}</td>
                    <td className="px-6 py-4">{user.email || "N/A"}</td>
                    <td className="px-6 py-4">{user.mobile || "N/A"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <RiEdit2Line className="m-1 rounded-full hover:bg-gray-300 p-1 h-7 w-7 cursor-pointer" />
                        <MdOutlineRemoveRedEye className="m-1 rounded-full hover:bg-gray-300 p-1 h-7 w-7 cursor-pointer" />
                        <IoTrashOutline className="m-1 rounded-full hover:bg-gray-300 p-1 h-7 w-7 cursor-pointer text-red-500" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center my-4 mx-4 gap-4">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }
};

export default UserTable;
