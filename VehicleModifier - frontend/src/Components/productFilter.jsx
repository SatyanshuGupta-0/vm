import { useState, useEffect } from "react";
import FilterSidebar from "./FilterSidebar";
import { fetchDataFromApi } from "../utils/api";

const ProductPage = () => {
  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);

  const brands = ["Apple", "Samsung", "Xiaomi"];
  const categories = ["Mobile Phones", "Laptops", "Accessories"];

  useEffect(() => {
    const query = new URLSearchParams();

    if (filters.name) query.append("name", filters.name);
    if (filters.minPrice) query.append("minPrice", filters.minPrice);
    if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);
    if (filters.rating) query.append("rating", filters.rating);
    if (filters.inStock) query.append("countInStock", "1");
    if (filters.isFeatured) query.append("isFeatured", "true");

    if (filters.brand?.length)
      filters.brand.forEach((b) => query.append("brand", b));
    if (filters.category?.length)
      filters.category.forEach((c) => query.append("catName", c));

    fetchDataFromApi(`/api/product/search?${query.toString()}`)
      .then((res) => setProducts(res))
      .catch(console.error);
  }, [filters]);

  return (
    <div className="flex gap-4 p-4">
      <FilterSidebar
        filters={filters}
        setFilters={setFilters}
        brands={brands}
        categories={categories}
      />

      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border p-4 rounded shadow">
              <img
                src={p.images?.[0]}
                alt={p.name}
                className="h-40 w-full object-cover rounded mb-2"
              />
              <h3 className="font-semibold">{p.name}</h3>
              <p>${p.price}</p>
              <p className="text-sm text-gray-500">{p.brand}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
