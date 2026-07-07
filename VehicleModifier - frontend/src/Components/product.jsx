import { useEffect, useState } from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { postData, fetchDataFromApi, deleteData } from "../utils/api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoShareAndroid } from "react-icons/go";
import SharePopup from "./SharePopup";



// Utility to check MongoDB ObjectId format
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

// SEO slug generator
const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Product = ({ product }) => {
  const [wishlistHeart, setWishlistHeart] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accesstoken");
  const [showShare, setShowShare] = useState(false);

  if (!product) return null;

  // ----------------------------
  // VARIANT & SIZE
  // ----------------------------
  const queryParams = new URLSearchParams(location.search);
  const colorQuery = queryParams.get("color");
  const sizeQuery = queryParams.get("size");
  const widthQuery = queryParams.get("width");
  const pcdQuery = queryParams.get("pcd");
  const cbQuery = queryParams.get("cb");


  // Match variant
  const matchedVariant = product?.variantOptions?.find(
    (variant) =>
      variant?.color?.name?.toLowerCase() === (colorQuery || product?.variantColor || "").toLowerCase()
  ) || product?.variantOptions?.[0];

  // Match size
  const matchedSize = matchedVariant?.sizes?.find(
    (size) =>
      size?.name?.toLowerCase() === (sizeQuery || product?.variantSize || "").toLowerCase()
  ) || matchedVariant?.sizes?.[0];

  // ----------------------------
  // CLEAN IDS
  // ----------------------------
    const extractedIds = typeof product._id === "string" ? product._id.split("-") : [];
  const productIdFromSplit = extractedIds[0];
  const variantIndex = extractedIds[1];
  const sizeIndex = extractedIds[2];
  const cleanProductId = isValidObjectId(product?.productId)
    ? product.productId
    : product?.productId?._id || productIdFromSplit || product?._id;

  const cleanVariantId = isValidObjectId(product?.variantId)
    ? product.variantId
    : matchedVariant?._id;

  const cleanSizeId = isValidObjectId(product?.sizeId)
    ? product.sizeId
    : matchedSize?._id;

  // ----------------------------
  // IMAGE & PRICE
  // ----------------------------
  const variantImage =
    matchedVariant?.color?.images?.[0]?.url ||
    product?.images?.[0]?.url ||
    product?.images?.[0] ||
    "";

  const variantPrice =
    matchedSize?.price ||
    matchedVariant?.price ||
    product?.price ||
    0;

  const discountPercent =
    product?.oldPrice && variantPrice && product.oldPrice > variantPrice
      ? Math.round(((product.oldPrice - variantPrice) / product.oldPrice) * 100)
      : 0;

  // ----------------------------
  // DYNAMIC URL QUERY STRING
  // // ----------------------------
  // const urlParams = new URLSearchParams();
  // if (matchedVariant?.color?.name) urlParams.append("color", matchedVariant.color.name);
  // if (matchedSize?.name) urlParams.append("size", matchedSize.name);
  // if (matchedSize?.width) urlParams.append("width", matchedSize.width);
  // if (matchedSize?.pcd) urlParams.append("pcd", matchedSize.pcd);
  // if (matchedSize?.cb) urlParams.append("cb", matchedSize.cb);

  // const seoSlug = slugify(`${product.brand || ""} ${product.name}`);
  // const productUrl = `/product/${seoSlug}${urlParams.toString() ? "?" + urlParams.toString() : ""}`;
const urlParams = new URLSearchParams();
if (product.variantColor) urlParams.append("color", product.variantColor);
if (product.variantSize) urlParams.append("size", product.variantSize);
if (product.width) urlParams.append("width", product.width);
if (product.pcd) urlParams.append("pcd", product.pcd);
if (product.cb) urlParams.append("cb", product.cb);

const seoSlug = slugify(`${product.brand || ""} ${product.name}`);
const productUrl = `/product/${seoSlug}${urlParams.toString() ? "?" + urlParams.toString() : ""}`;
// const referralCode = localStorage.getItem("referralCode");
// const absoluteProductUrl = new URL(productUrl, window.location.origin).href;
const referralCode = localStorage.getItem("referralCode"); // get saved referral code
const absoluteProductUrl = new URL(productUrl, window.location.origin);
if (referralCode) {
  absoluteProductUrl.searchParams.set("ref", referralCode); // add ?ref=CODE
}
// ----------------------------
  // CHECK WISHLIST
  // ----------------------------
 useEffect(() => {
    const checkWishlist = async () => {
      if (!token || !cleanProductId || !cleanVariantId) return;

      try {
        const res = await fetchDataFromApi("/api/wishlist");
        const wishlist = res?.wishlist || [];

        const match = wishlist.find((item) => {
          const itemProductId = typeof item.productId === "string" ? item.productId : item.productId?._id;
          const itemVariantId = typeof item.variantId === "string" ? item.variantId : item.variantId?._id;
          const itemSizeId = typeof item.sizeId === "string" ? item.sizeId : item.sizeId?._id;

          return (
            itemProductId === cleanProductId &&
            itemVariantId === cleanVariantId &&
            itemSizeId === cleanSizeId
          );
        });

        if (match) {
          setWishlistHeart(true);
          setWishlistItemId(match._id);
        } else {
          setWishlistHeart(false);
          setWishlistItemId(null);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    };

    checkWishlist();
  }, [cleanProductId, cleanVariantId, cleanSizeId, token]);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    const previousHeart = wishlistHeart;
    setWishlistHeart(!wishlistHeart);

    try {
      if (!previousHeart) {
        if (
          !isValidObjectId(cleanProductId) ||
          !isValidObjectId(cleanVariantId) ||
          !isValidObjectId(cleanSizeId)
        ) {
          alert("This product has an invalid ID and cannot be added to wishlist.");
          setWishlistHeart(previousHeart);
          return;
        }

        const payload = {
          productId: cleanProductId,
          variantId: cleanVariantId,
          sizeId: cleanSizeId,
        };

        const res = await postData("/api/wishlist/add", payload);
        setWishlistItemId(res?.wishlist?._id);
      } else if (wishlistItemId) {
        await deleteData(`/api/wishlist/${wishlistItemId}`);
        setWishlistItemId(null);
      }
    } catch (err) {
      console.error("Wishlist action failed:", err);
      setWishlistHeart(previousHeart);
    }
  };

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <>
    <Link to={productUrl}>
      <div className="min-h-[18rem] xs:w-44 sm:w-52 rounded-lg overflow-hidden shadow-lg relative group bg-white">
        <div className="relative w-full h-32 bg-white">
          <img
            className="m-auto h-full w-full object-contain"
            src={variantImage}
            alt={product?.name || "Product Image"}
          />
          <div className="absolute top-1 right-1 z-10 bg-white p-1 rounded-full">
            {wishlistHeart ? (
              <IoMdHeart
                onClick={toggleWishlist}
                className="text-red-600 cursor-pointer transition duration-300"
              />
            ) : (
              <IoMdHeartEmpty
                onClick={toggleWishlist}
                className="cursor-pointer transition duration-300"
              />
            )}
          </div>
          <div className="absolute top-10 right-1 z-10 bg-white p-1 rounded-full">
            <GoShareAndroid
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowShare(true);
                }}
              />
          </div>
        </div>

        <div className="ml-3 mt-2 font-semibold text-lg px-2 truncate">{product?.name || "Unnamed Product"}</div>

              
        <div className="ml-5 text-xs text-gray-500">
          {matchedVariant?.color?.name && <span>Color: {matchedVariant.color.name}, </span>}
          {matchedSize?.name && <span>Size: {matchedSize.name}</span>}
          {matchedSize?.width && <span>, Width: {matchedSize.width}</span>}
         
        </div>

        <div className="ml-4 mt-3 px-2 pb-2">
          {product?.oldPrice && product.oldPrice > variantPrice && (
            <div className="text-xs text-gray-500 line-through">₹{product.oldPrice}</div>
          )}
          {discountPercent > 0 && (
            <div className="text-xs text-green-600 font-medium">{discountPercent}% off</div>
          )}
          <div className="text-md font-bold text-black">₹{variantPrice}</div>
        </div>
      </div>
    </Link>
          {showShare && (
        <SharePopup
          url={absoluteProductUrl} // ✅ absolute URL that matches hover
          title={product?.name}
          onClose={() => setShowShare(false)}
        />
      )}
      </>
  );
};

export default Product;
