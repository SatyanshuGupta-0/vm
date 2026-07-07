// components/FilterPopup.jsx
import { useEffect } from "react";

const FilterPopup = ({ show, onClose, filters, setFilters, brands, categories }) => {
  const handleCheckboxChange = (group, value) => {
    setFilters((prev) => {
      const existing = prev[group] || [];
      return {
        ...prev,
        [group]: existing.includes(value)
          ? existing.filter((v) => v !== value)
          : [...existing, value],
      };
    });
  };

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed mt-10 inset-0 z-10 flex justify-center items-center bg-black bg-opacity-30">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <button
          className="absolute top-2 right-3 text-lg font-bold"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        <input
          type="text"
          placeholder="Search by Product ID..."
          className="w-full border px-3 py-1 mb-4"
          value={filters.productId || ""}
          onChange={(e) => handleInputChange("productId", e.target.value)}
        />

       <input
  type="text"
  placeholder="Search by Variant ID..."
  className="w-full border px-3 py-1 mb-4"
  value={filters.variantId || ""}
  onChange={(e) => handleInputChange("variantId", e.target.value)}
/>

        <input
          type="text"
          placeholder="Search name..."
          className="w-full border px-3 py-1 mb-4"
          value={filters.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />

        <h4 className="font-medium mb-1">Brand</h4>
        {brands.map((brand) => (
          <label key={brand} className="block">
            <input
              type="checkbox"
              checked={filters.brand?.includes(brand) || false}
              onChange={() => handleCheckboxChange("brand", brand)}
              className="mr-2"
            />
            {brand}
          </label>
        ))}

        <h4 className="font-medium mt-4 mb-1">Category</h4>
        {categories.map((cat) => (
          <label key={cat} className="block">
            <input
              type="checkbox"
              checked={filters.category?.includes(cat) || false}
              onChange={() => handleCheckboxChange("category", cat)}
              className="mr-2"
            />
            {cat}
          </label>
        ))}

        <h4 className="font-medium mt-4 mb-1">Price</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 border px-2 py-1"
            value={filters.minPrice || ""}
            onChange={(e) => handleInputChange("minPrice", e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 border px-2 py-1"
            value={filters.maxPrice || ""}
            onChange={(e) => handleInputChange("maxPrice", e.target.value)}
          />
        </div>

        <h4 className="font-medium mt-4 mb-1">Minimum Rating</h4>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={filters.rating || 0}
          onChange={(e) => handleInputChange("rating", e.target.value)}
          className="w-full"
        />
        <p>{filters.rating || 0}⭐ & up</p>

        <label className="block mt-4">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={() =>
              handleInputChange("inStock", !filters.inStock)
            }
            className="mr-2"
          />
          In Stock Only
        </label>

        <label className="block mt-2">
          <input
            type="checkbox"
            checked={filters.isFeatured || false}
            onChange={() =>
              handleInputChange("isFeatured", !filters.isFeatured)
            }
            className="mr-2"
          />
          Featured
        </label>

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          onClick={onClose}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPopup;
