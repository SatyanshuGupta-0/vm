import { useState, useEffect, useRef, useCallback } from "react";
import Product from "./Product";
import { fetchDataFromApi } from "../utils/api";
import Loader from "./Loader";

const PRODUCTS_PER_PAGE = 20;

const Allproduct = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observer = useRef();

  // Fetch paginated products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi(
        `/api/product/getPaginatedProducts?page=${page}&limit=${PRODUCTS_PER_PAGE}`
      );

      const originalProducts = Array.isArray(res.products)
        ? res.products
        : Array.isArray(res.data)
        ? res.data
        : [];

      const expandedProducts = [];

      // Expand product variants into individual items
      originalProducts.forEach((prod) => {
        if (Array.isArray(prod.variantOptions) && prod.variantOptions.length > 0) {
          prod.variantOptions.forEach((variant, variantIndex) => {
            const sizes = Array.isArray(variant.sizes) ? variant.sizes : [];

            sizes.forEach((size, sizeIndex) => {
              expandedProducts.push({
                ...prod,
                _id: `${prod._id}-${variantIndex}-${sizeIndex}`, // Unique ID
                images:
                  Array.isArray(variant.color?.images) && variant.color.images.length > 0
                    ? variant.color.images
                    : prod.images,
                variantColor: variant.color?.name || "",
                variantColorHex: variant.color?.hex || "",
                variantSize: size.name || "",
                price: size.price || "",
                oldPrice: size.oldPrice || "",
                stock: size.stock || "",
              });
            });
          });
        } else {
          // Fallback for products without variantOptions
          expandedProducts.push(prod);
        }
      });

      // Shuffle products to randomize display
      for (let i = expandedProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [expandedProducts[i], expandedProducts[j]] = [expandedProducts[j], expandedProducts[i]];
      }

      // Merge and deduplicate
      setProducts((prev) => {
        const merged = [...prev, ...expandedProducts];
        const unique = [];
        const seen = new Set();

        for (const prod of merged) {
          if (!seen.has(prod._id)) {
            seen.add(prod._id);
            unique.push(prod);
          }
        }

        return unique;
      });

      // Determine if there are more pages
      const totalPages = res.totalPages || 1;
      if (page >= totalPages || expandedProducts.length < PRODUCTS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on page change
  useEffect(() => {
    fetchProducts();
  }, [page]);

  // Infinite scroll: observe last product
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

  // Error UI
  if (error) return <Loader />;

  return (
    <div className="p-2">
      <div className="grid gap-4 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 place-items-center">
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

      {loading && <Loader />}
      {!hasMore && !loading && (
        <div className="text-center mt-4 text-gray-500">No more products.</div>
      )}
    </div>
  );
};

export default Allproduct;
