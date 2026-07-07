import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Product from "../product";
import { fetchDataFromApi } from "../../utils/api";
import Loader from "../Loader";

const Wishlist = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);

    try {
      const wishlistRes = await fetchDataFromApi("/api/wishlist");
      const wishlist = wishlistRes?.wishlist || [];

      const productFetches = wishlist.map(async (item) => {
        const product = item.productId;
        const variantId = item.variantId;
        const sizeId = item.sizeId;

        if (!product || !product.variantOptions) return null;

        const variant = product.variantOptions.find((v) => v._id === variantId);
        if (!variant) return null;

        const matchedSize = variant.sizes?.find((s) => s._id === sizeId);
        if (!matchedSize) return null;

        return {
          _id: `${product._id}-${variantId}-${sizeId}`,
          name: product.name || "Unnamed Product",
          description: product.description || "",
          brand: product.brand || "",
          images:
            variant.color?.images?.map((img) =>
              typeof img === "string" ? img : img.url
            ) || product.images || [],
          variantColor: variant.color?.name || "",
          variantColorHex: variant.color?.hex || "",
          variantSize: matchedSize.name || "",
          price: matchedSize.price || 0,
          oldPrice: matchedSize.oldPrice || 0,
          stock: matchedSize.stock || 0,
          rating: product.rating || 0,

          // Important for Product component
          productId: product,
          variantId,
          sizeId,
        };
      });

      const results = await Promise.all(productFetches);
      const filtered = results.filter(Boolean);
      setProducts(filtered);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setError("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (products.length === 0)
    return <div className="text-center py-10">No products in wishlist.</div>;

  return (
    <div className="mt-12 m-2">
      <h2 className="text-2xl m-3 font-semibold">Wishlist</h2>
      <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {products.map((product) => {
          return <Product key={product._id} product={product} />;
        })}
      </div>
    </div>
  );
};

export default Wishlist;
