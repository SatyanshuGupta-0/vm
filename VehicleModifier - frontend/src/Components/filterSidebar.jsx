import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const CollapsibleSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center cursor-pointer text-md font-semibold text-gray-700"
        onClick={() => setOpen(!open)}
      >
        <h4>{title}</h4>
        {open ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
      </div>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
};

const FilterSidebar = ({ filters, setFilters, brands, categories }) => {
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

  return (
    <div className="w-full md:w-64 bg-white p-4 shadow-lg border rounded-md sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-2">Filters</h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={filters.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      </div>

      {/* Brand Filter */}
      <CollapsibleSection title="Brand">
        <div className="max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                checked={filters.brand?.includes(brand) || false}
                onChange={() => handleCheckboxChange("brand", brand)}
                className="mr-2"
              />
              {brand}
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {/* Category Filter */}
      <CollapsibleSection title="Category">
        <div className="max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                checked={filters.category?.includes(cat) || false}
                onChange={() => handleCheckboxChange("category", cat)}
                className="mr-2"
              />
              {cat}
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {/* Price Range */}
      <CollapsibleSection title="Price Range">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 border px-2 py-1 rounded-md text-sm"
            value={filters.minPrice || ""}
            onChange={(e) => handleInputChange("minPrice", e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 border px-2 py-1 rounded-md text-sm"
            value={filters.maxPrice || ""}
            onChange={(e) => handleInputChange("maxPrice", e.target.value)}
          />
        </div>
      </CollapsibleSection>

      {/* Rating */}
      <CollapsibleSection title="Minimum Rating">
        <div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={filters.rating || 0}
            onChange={(e) => handleInputChange("rating", e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-gray-700">{filters.rating || 0}⭐ & above</p>
        </div>
      </CollapsibleSection>

      {/* Toggle Checkboxes */}
      <CollapsibleSection title="Availability">
        <label className="flex items-center text-sm mb-1">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={() => handleInputChange("inStock", !filters.inStock)}
            className="mr-2"
          />
          In Stock
        </label>
        <label className="flex items-center text-sm mb-1">
          <input
            type="checkbox"
            checked={filters.isFeatured || false}
            onChange={() => handleInputChange("isFeatured", !filters.isFeatured)}
            className="mr-2"
          />
          Featured
        </label>
        
      </CollapsibleSection>
    </div>
  );
};

export default FilterSidebar;
