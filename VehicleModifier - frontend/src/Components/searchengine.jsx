// components/ProductSearch.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../utils/api";
import { FaSearch } from "react-icons/fa";

let debounceTimeout;

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setProducts([]);
      setShowDropdown(false);
      return;
    }

    if (debounceTimeout) clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
      setLoading(true);
      fetchDataFromApi(`/api/product/search?query=${encodeURIComponent(searchTerm)}`)
        .then((res) => {
          setProducts(res || []);
          setShowDropdown(true);
        })
        .catch((err) => {
          console.error("Search error:", err);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const handleSelect = (word) => {
    setSearchTerm("");
    setShowDropdown(false);
    navigate(`/searching?query=${encodeURIComponent(word)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      handleSelect(searchTerm.trim());
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search for products, categories, etc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full focus:outline-none"
          onFocus={() => searchTerm && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        />
      </div>

      {showDropdown && products.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded shadow-lg mt-1 max-h-80 overflow-y-auto">
          {products.slice(0, 6).map((product, index) => (
            <li
              key={product._id + index}
              onMouseDown={() => handleSelect(product.name)}
              className="p-3 hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-center gap-3 bg-cover">
                <img
                  src={
                    product?.variantOptions?.[0]?.color?.images?.[0]?.url ||
                    "/VM2_logo-Photoroom.png"
                  }

                  alt={product.name}
                  className="w-10 h-10 object-contain rounded bg-white" />
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.catName}</p>
                </div>
              </div>
            </li>
          ))}

          {/* Optional Suggestions */}
          <li
            onMouseDown={() => handleSelect(searchTerm)}
            className="p-3 hover:bg-blue-100 cursor-pointer text-blue-600"
          >
            Search for "{searchTerm}" in all categories
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProductSearch;
