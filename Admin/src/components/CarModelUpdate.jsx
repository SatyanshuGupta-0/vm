import { useEffect, useState } from "react";
import { RiEdit2Line } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { PiExportBold } from "react-icons/pi";
import { FiFilter } from "react-icons/fi";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { fetchDataFromApi, deleteData } from "../utils/api";
import FilterPopup from "./filter";

const MODELS_PER_PAGE = 6;

const CarModelTable = () => {
  const [carModels, setCarModels] = useState([]);
  const [filters, setFilters] = useState({});
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const blockedRoles = ["shopkeeper", "guest"];
  const userRole = localStorage.getItem("name");

  const navigate = useNavigate();

  useEffect(() => {
    loadCarModels();
  }, []);

  const loadCarModels = async () => {
    try {
      const res = await fetchDataFromApi("/api/carModel");
      setCarModels(res);
      setBrands([...new Set(res.map((m) => m.brand).filter(Boolean))]);
      setCategories([...new Set(res.map((m) => m.category).filter(Boolean))]);
    } catch (err) {
      console.error("Failed to fetch car models:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this car model?")) {
      try {
        await deleteData("/api/carModel/" + id);
        setCarModels((prev) => prev.filter((model) => model._id !== id));
      } catch (err) {
        console.error("Failed to delete car model:", err);
      }
    }
  };

  const filteredModels = carModels.filter((model) => {
    const {
      name,
      brand = [],
      category = [],
      isFeatured,
      inStock,
    } = filters;

    const matchesName = name ? model.name?.toLowerCase().includes(name.toLowerCase()) : true;
    const matchesBrand = brand.length > 0 ? brand.includes(model.brand) : true;
    const matchesCategory = category.length > 0 ? category.includes(model.category) : true;
    const matchesFeatured = isFeatured ? model.isFeatured === true : true;
    const matchesStock = inStock ? model.countInStock > 0 : true;

    return matchesName && matchesBrand && matchesCategory && matchesFeatured && matchesStock;
  });

  const totalPages = Math.ceil(filteredModels.length / MODELS_PER_PAGE);
  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * MODELS_PER_PAGE,
    currentPage * MODELS_PER_PAGE
  );

if (!blockedRoles.includes(userRole)) {
  return (
    <div className="m-3 border-2 border-black border-opacity-10 rounded-lg">
      <div className="flex items-center justify-between flex-wrap">
        <h3 className="p-3 text-xl font-bold">Car Models</h3>
        <div className="flex items-center gap-2 px-3">
          <Button className="!bg-green-200 !capitalize !text-black">
            <PiExportBold className="mr-1" /> Export
          </Button>
          <Link to="/car-model/add">
            <Button className="!bg-blue-200 !capitalize !text-black">
              <IoMdAdd className="mr-1" /> Add Car Model
            </Button>
          </Link>
          <Button
            className="!bg-yellow-200 !capitalize !text-black"
            onClick={() => setShowFilter(true)}
          >
            <FiFilter className="mr-1" /> Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="relative mx-3 mb-3 overflow-x-auto shadow-md sm:rounded-lg border-2 border-black border-opacity-10">
        <table className="w-full text-sm text-left text-black">
          <thead className="text-xs uppercase bg-[#f1f1f1]">
            <tr>
              <th className="p-4"><input type="checkbox" className="w-4 h-4" /></th>
              <th className="px-6 py-3">MODEL NAME</th>
              <th className="px-6 py-3">BRAND</th>
              <th className="px-6 py-3">CATEGORY</th>
              <th className="px-6 py-3">PCD</th>
              <th className="px-6 py-3">CB</th>
              <th className="px-6 py-3">ET</th>
              <th className="px-6 py-3">COLOR</th>
              <th className="px-6 py-3">YEAR</th>
              <th className="px-6 py-3">MODEL IMAGE</th>
              <th className="px-6 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedModels.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center p-5">
                  No car models found.
                </td>
              </tr>
            ) : (
              paginatedModels.map((model) => (
                <tr key={model._id} className="bg-white border-b">
                  <td className="p-4"><input type="checkbox" className="w-4 h-4" /></td>
                  <td className="px-6 py-4">{model.carName || "—"}</td>
                  <td className="px-6 py-4">{model.brand || "—"}</td>
                  <td className="px-6 py-4">{model.category || "—"}</td>
                  <td className="px-6 py-4">{model.pcd || "—"}</td>
                  <td className="px-6 py-4">{model.cb || "—"}</td>
                  <td className="px-6 py-4">{model.et || "—"}</td>
                  <td className="px-6 py-4">{model.color || "—"}</td>
                  <td className="px-6 py-4">{model.modelCarYear || "—"}</td>
                  <td className="px-6 py-4">
                    {model.imageUrl ? (
                      <img
                        src={model.imageUrl}
                        alt={`${model.carName}`}
                        className="w-20 h-12 object-cover rounded shadow"
                      />
                    ) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <RiEdit2Line
                        title="Edit"
                        onClick={() => navigate(`/car-model/edit/${model._id}`)}
                        className="m-1 rounded-full hover:bg-gray-200 p-1 h-7 w-7 cursor-pointer"
                      />
                      <MdOutlineRemoveRedEye
                        title="View"
                        onClick={() => navigate(`/car-model/view/${model._id}`)}
                        className="m-1 rounded-full hover:bg-gray-200 p-1 h-7 w-7 cursor-pointer"
                      />
                      <IoTrashOutline
                        title="Delete"
                        onClick={() => handleDelete(model._id)}
                        className="m-1 rounded-full hover:bg-gray-200 p-1 h-7 w-7 cursor-pointer text-red-500"
                      />
                    </div>
                  </td>
                </tr>
              ))
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
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </Button>
          <Button
            variant="outlined"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Filter Popup */}
      <FilterPopup
        show={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        setFilters={setFilters}
        brands={brands}
        categories={categories}
      />
    </div>
  );
}
};

export default CarModelTable;
