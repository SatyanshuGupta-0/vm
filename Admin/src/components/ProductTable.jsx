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

const PRODUCTS_PER_PAGE = 6;

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const blockedRoles = ["superadmin"]; // should be an array
const userRole = localStorage.getItem("name");
const navigate = useNavigate();

useEffect(() => {
  loadProducts();
}, []);

const loadProducts = async () => {
  try {
    let res;

    if (!blockedRoles.includes(userRole)) {
      res = await fetchDataFromApi("/api/product/getProducts");
    } else {
      res = await fetchDataFromApi("/api/product/getAllProducts");
    }

    setProducts(res);
    setBrands([...new Set(res.map((p) => p.brandName).filter(Boolean))]);
    setCategories([...new Set(res.map((p) => p.catName).filter(Boolean))]);
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
};

 const handleDelete = async (productId, variantId = null) => {
  if (!window.confirm(variantId
    ? "Are you sure you want to delete this variant?"
    : "Are you sure you want to delete this product?")) return;

  try {
    if (variantId) {
      // Find the product in local state
      const product = products.find(p => p._id === productId);
      if (!product) {
        alert("Product not found");
        return;
      }

      // If only one variant exists, delete entire product
      if (product.variantOptions && product.variantOptions.length === 1) {
        await deleteData(`/api/product/deletes/${productId}`);
        setProducts(prev => prev.filter(p => p._id !== productId));
      } else {
        // Delete variant only
        await deleteData(`/api/product/${productId}/variant/${variantId}`);
        setProducts(prev =>
          prev.map(product =>
            product._id === productId
              ? {
                  ...product,
                  variantOptions: product.variantOptions.filter(
                    variant => variant._id !== variantId
                  ),
                }
              : product
          )
        );
      }
    } else {
      // Delete entire product
      await deleteData(`/api/product/${productId}`);
      setProducts(prev => prev.filter(p => p._id !== productId));
    }
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Delete failed. See console for details.");
  }
};

  // ✅ SAFE Flattened products
  const flattenedProducts = products.flatMap((product) => {
    if (product.variantOptions && product.variantOptions.length > 0) {
      return product.variantOptions.map((variant) => {
        const colorName =
          typeof variant.color === "string"
            ? variant.color
            : variant.color?.name?.trim() || "Default";

        return {
          productId: product._id,
          name: product.name,
          brandName: product.brandName,
          catName: product.catName,
          subCatName: product.subCatName,
          variantId: variant._id || variant.id,
          price: variant?.sizes?.[0]?.price ?? product.price ?? 0,
          colorName,
          images: variant.color?.images || [],
          inStock: variant.inStock ?? product.inStock ?? false,
          rating: product.rating ?? 0,
          isFeatured: product.isFeatured ?? false,
          sales: product.sales ?? 0,
        };
      });
    } else {
      return [
        {
          productId: product._id,
          name: product.name,
          brandName: product.brandName,
          catName: product.catName,
          subCatName: product.subCatName,
          variantId: null,
          price: product.price ?? 0,
          colorName: product.colorName || "—",
          images: product.images || [],
          inStock: product.inStock ?? false,
          rating: product.rating ?? 0,
          isFeatured: product.isFeatured ?? false,
          sales: product.sales ?? 0,
        },
      ];
    }
  });

  const {
    name,
    brand = [],
    category = [],
    minPrice,
    maxPrice,
    rating,
    inStock,
    isFeatured,
    productId,
    variantId,
  } = filters;

  const filteredProducts = flattenedProducts.filter((item) => {
    const matchesName = name ? item.name.toLowerCase().includes(name.toLowerCase()) : true;
    const matchesBrand = brand.length > 0 ? brand.includes(item.brandName) : true;
    const matchesCategory = category.length > 0 ? category.includes(item.catName) : true;
    const matchesPrice =
      (!minPrice || item.price >= Number(minPrice)) &&
      (!maxPrice || item.price <= Number(maxPrice));
    const matchesRating = rating ? item.rating >= Number(rating) : true;
    const matchesStock = inStock ? item.inStock === true : true;
    const matchesFeatured = isFeatured ? item.isFeatured === true : true;
    const matchesProductId = productId ? item.productId.includes(productId) : true;
    const matchesVariantId = variantId ? (item.variantId || "").includes(variantId) : true;

    return (
      matchesName &&
      matchesBrand &&
      matchesCategory &&
      matchesPrice &&
      matchesRating &&
      matchesStock &&
      matchesFeatured &&
      matchesProductId &&
      matchesVariantId
    );
  });

  const sortedProducts = [...filteredProducts];
  if (sortConfig.key) {
    sortedProducts.sort((a, b) => {
      if (sortConfig.key === "price") {
        return sortConfig.direction === "asc" ? a.price - b.price : b.price - a.price;
      } else {
        const aVal = (a[sortConfig.key] ?? "").toString().toLowerCase();
        const bVal = (b[sortConfig.key] ?? "").toString().toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }
    });
  }

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="m-3 border-2 border-black border-opacity-10 rounded-lg">
      <div className="flex items-center justify-between flex-wrap">
        <h3 className="p-3 text-xl font-bold">Products</h3>
        <div className="flex items-center gap-2 px-3">
          {/* <Button className="!bg-green-200 !capitalize !text-black">
            <PiExportBold className="mr-1" /> Export
          </Button> */}
          <Link to="/product/add">
            <Button className="!bg-blue-200 !capitalize !text-black">
              <IoMdAdd className="mr-1" /> Add Product
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

      <div className="relative mx-3 mb-3 overflow-x-auto shadow-md sm:rounded-lg border-2 border-black border-opacity-10">
        <table className="w-full text-sm text-left text-black">
          <thead className="text-xs uppercase bg-[#f1f1f1]">
            <tr>
              <th className="p-4">
                <input type="checkbox" className="w-4 h-4" />
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("name")}>
                PRODUCT{renderSortArrow("name")}
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("colorName")}>
                COLOR{renderSortArrow("colorName")}
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("catName")}>
                CATEGORY{renderSortArrow("catName")}
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("subCatName")}>
                SUB CATEGORY{renderSortArrow("subCatName")}
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("price")}>
                PRICE{renderSortArrow("price")}
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("sales")}>
                SALES{renderSortArrow("sales")}
              </th>
              <th className="px-6 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-5">
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((item) => (
                <tr
                  key={item.variantId || item.productId}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    <input type="checkbox" className="w-4 h-4" />
                  </td>
                  <td className="px-6 py-4 flex items-center">
                    <img
                      className="h-12 w-12 object-cover rounded mr-2"
                      src={item.images?.[0]?.url || "/VM2_logo-Photoroom.png"}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                    {item.name}
                  </td>
                  <td className="px-6 py-4">{item.colorName || "—"}</td>
                  <td className="px-6 py-4">{item.catName || "—"}</td>
                  <td className="px-6 py-4">{item.subCatName || "—"}</td>
                  <td className="px-6 py-4">₹{(item.price ?? 0).toFixed(2)}</td>
                  <td className="px-6 py-4">{item.sales ?? 0}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => navigate(`/product/view/${item.productId}`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <MdOutlineRemoveRedEye size={20} />
                    </button>
                    <button
                      onClick={() => navigate(`/product/edit/${item.productId}`)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <RiEdit2Line size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.productId, item.variantId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <IoTrashOutline size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center space-x-2 py-2">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showFilter && (
        <FilterPopup
          show={showFilter}
          brands={brands}
          categories={categories}
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
};

export default ProductTable;



