import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Product from "./Product";
import FilterSidebar from "./FilterSidebar";
import { fetchDataFromApi } from "../utils/api";
import { CiFilter } from "react-icons/ci";
import { MdFilterAltOff } from "react-icons/md";
import ProductSearch from "./searchengine";

const PRODUCTS_PER_PAGE = 20;

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query") || "";

  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const observer = useRef();

  const fetchInitialProducts = async () => {
    try {
      const res = await fetchDataFromApi(`/api/product/getAllProducts`);
      const productsArray = Array.isArray(res) ? res : [];
      setAllProducts(productsArray);
    } catch (err) {
      console.error("Error fetching all products for filters:", err);
    }
  };

  const fetchProducts = async () => {
  setLoading(true);
  try {
    const res = await fetchDataFromApi("/api/product/getAllProducts");
    let originalProducts = Array.isArray(res) ? res : [];

    // Step 1: Filter products by general attributes
    originalProducts = originalProducts.filter((prod) => {
      const matchName = filters.name
        ? prod.name.toLowerCase().includes(filters.name.toLowerCase())
        : true;

      const matchBrand = filters.brand?.length
        ? filters.brand.includes(prod.brand)
        : true;

      const matchCategory = filters.category?.length
        ? filters.category.includes(prod.catName || prod.category)
        : true;

      const matchRating = filters.rating ? prod.rating >= filters.rating : true;
      const matchFeatured = filters.isFeatured ? prod.isFeatured === true : true;

      return (
        matchName &&
        matchBrand &&
        matchCategory &&
        matchRating &&
        matchFeatured
      );
    });

    // Step 2: Expand and filter variants
    const minPrice = filters.minPrice || 0;
    const maxPrice = filters.maxPrice || Infinity;
    const expandedProducts = [];

    originalProducts.forEach((prod) => {
      prod.variantOptions?.forEach((variant, variantIndex) => {
        variant.sizes?.forEach((size, sizeIndex) => {
          const price = Number(size.price) || 0;
          const stock = Number(size.stock) || 0;

          const withinPriceRange = price >= minPrice && price <= maxPrice;
          const inStock = !filters.inStock || stock > 0;

          if (withinPriceRange && inStock) {
            expandedProducts.push({
              ...prod,
              _id: `${prod._id}-${variantIndex}-${sizeIndex}`,
              images: variant.color?.images?.length
                ? variant.color.images
                : prod.images,
              variantColor: variant.color?.name || "",
              variantColorHex: variant.color?.hex || "",
              variantSize: size.name || "",
              price: price,
              oldPrice: size.oldPrice || "",
              stock: stock,
            });
          }
        });
      });
    });

    // Step 3: Sort if needed
    if (filters.sortBy === "priceLowToHigh") {
      expandedProducts.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "priceHighToLow") {
      expandedProducts.sort((a, b) => b.price - a.price);
    }

    // Step 4: Pagination
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const paginated = expandedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    setProducts((prev) => (page === 1 ? paginated : [...prev, ...paginated]));
    setHasMore(expandedProducts.length > page * PRODUCTS_PER_PAGE);
  } catch (err) {
    console.error("Error fetching products:", err);
    setError("Failed to load products. Please try again later.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [searchTerm, filters]);

  useEffect(() => {
    fetchInitialProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, filters]);

  const lastProductRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const brandList = [...new Set(allProducts.map((p) => p.brand).filter(Boolean))];
  const categoryList = [...new Set(allProducts.map((p) => p.catName || p.category).filter(Boolean))];

  return (
    <div className="relative mt-20">
      <div className="md:hidden mx-3">
        <ProductSearch />
      </div>
      <div className="sticky top-0 z-40 bg-white p-2 border-b md:hidden flex justify-between items-center">
        <h2 className="text-lg font-bold">
          {searchTerm ? `Results for "${searchTerm}"` : "Products"}
        </h2>
        <button className="mx-3 text-2xl" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? <MdFilterAltOff /> : <CiFilter />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-4">
        <div className={`md:block ${showFilters ? "block" : "hidden"}`}>
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            brands={brandList}
            categories={categoryList}
          />
        </div>

        <div className="flex-1">
          <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-2 place-items-center">
            {products.map((prod, index) => {
              if (index === products.length - 1) {
                return (
                  <div ref={lastProductRef} key={prod._id}>
                    <Product product={prod} />
                  </div>
                );
              }
              return <Product key={prod._id} product={prod} />;
            })}
          </div>

          {loading && <div className="text-center mt-4">Loading more products...</div>}
          {!hasMore && !loading && (
            <div className="text-center mt-4 text-gray-500">No more products.</div>
          )}
          {error && <div className="text-center mt-4 text-red-600">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
