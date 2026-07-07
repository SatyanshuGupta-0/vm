import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchDataFromApi, postData, putData } from "../utils/api";
import Product from "./Product";
import { Helmet } from "react-helmet-async";
import { Md3dRotation } from "react-icons/md";
import ReviewForm from "./reviewForm";
import ProductReviewSection from "./reviewList";
import zIndex from "@mui/material/styles/zIndex";
import ConfirmModal from './customAlart';
import Loader from "./Loader";
import { useLocation } from "react-router-dom";
import { LuPencil } from "react-icons/lu";
import SharePopup from "./SharePopup";
import { GoShareAndroid } from "react-icons/go";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const ProductShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [variantids, setvariantid] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [userAddress, setUserAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariantSize, setSelectedVariantSize] = useState(null);
  const [form, setForm] = useState({ phone: "", address: "" });
  const [originalForm, setOriginalForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editAddressMode, setEditAddressMode] = useState(false);
  const [showDropup, setShowDropup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [colorImages, setColorImages] = useState([]);
  const [isSiteClosed, setIsSiteClosed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(" Cash on Delivery");
  const [showMore, setShowMore] = useState(false);
  const [saddress, setsaddress] = useState(false);
  const [popup, setPopup] = useState({ show: false, title: "", message: "", onConfirm: null });
    const [showShare, setShowShare] = useState(false);
    

// Get referral code from localStorage
const referralCode = localStorage.getItem("referralCode");

// Construct the absolute URL
let absoluteProductUrl = window.location.origin + location.pathname;

// Append referral code as query param
if (referralCode) {
  // If there are already query params
  if (location.search) {
    absoluteProductUrl += location.search + `&ref=${referralCode}`;
  } else {
    absoluteProductUrl += `?ref=${referralCode}`;
  }
}

  const MAX_LINES = 1;

  const showaddress = () => {
    setsaddress((prev) => !prev)
  }

  useEffect(() => {
    fetchDataFromApi("/api/toggle/toggle")
      .then((res) => setIsSiteClosed(res.isBuyDisabled))
      .catch(() => setIsSiteClosed(false));
  }, []);




  useEffect(() => {
    (async () => {
      // id is SLUG now
      const slug = id;

      const res = await fetchDataFromApi(
        `/api/product/get-by-slug/${slug}`
      );

      const queryParams = new URLSearchParams(location.search);

      const qColor = queryParams.get("color");
      const qSize = queryParams.get("size"); // "99 ml"
      const qCb = queryParams.get("cb");

      setProduct(res);

      let selectedVariant = null;
      let selectedSize = null;

      // 🔹 MATCH VARIANT USING QUERY PARAMS
      if (res.variantOptions?.length) {
        for (const variant of res.variantOptions) {

          // COLOR MATCH (if provided)
          if (
            qColor &&
            variant.color?.name?.toLowerCase() !== qColor.toLowerCase()
          ) continue;

          for (const size of variant.sizes) {

            if (
              (qSize && size.name !== qSize) ||
              (qCb && size.cb !== qCb)
            ) continue;

            selectedVariant = variant;
            selectedSize = size;
            break;
          }

          if (selectedVariant) break;
        }
      }

      // 🔹 FALLBACK (MANDATORY)
      if (!selectedVariant && res.variantOptions?.length) {
        selectedVariant = res.variantOptions[0];
      }

      if (!selectedSize && selectedVariant?.sizes?.length) {
        selectedSize = selectedVariant.sizes[0];
      }

      // 🔹 APPLY STATE
      if (selectedVariant && selectedSize) {
        setSelectedColor(selectedVariant.color);
        setSelectedSize(selectedVariant); // legacy
        setSelectedVariantSize(selectedSize);

        setvariantid(selectedSize._id); // ✅ payload ID
        setColorImages(
          selectedVariant.color.images.map((img) => img.url)
        );
      } else {
        setColorImages(res.images || []);
        setvariantid(null);
      }

      setActiveImage(0);
    })();
  }, [id, location.search]);

  useEffect(() => {
    if (!product || !selectedColor || !selectedVariantSize) return;

    const matchedVariant = product.variantOptions.find(
      (v) => v.color.name === selectedColor.name
    );

    if (!matchedVariant) return;

    const matchedSize = matchedVariant.sizes.find(
      (s) => s._id === selectedVariantSize._id
    );

    if (!matchedSize) return;

    const newPath =
      `/product/${product.slug}` +
      `?color=${matchedVariant.color.name}` +
      `&size=${matchedSize.name}` +
      (matchedSize.cb ? `&cb=${matchedSize.cb}` : "");

    if (location.pathname + location.search !== newPath) {
      navigate(newPath, { replace: true });
    }

    setvariantid(matchedSize._id); // payload
  }, [selectedColor, selectedVariantSize]);


  useEffect(() => {
    if (!product?._id) return; // wait until product is loaded

    const fetchRelatedProducts = async () => {
      try {
        const mainProductId = product._id; // ✅ use actual product id
        const res = await fetchDataFromApi(`/api/product/related/${mainProductId}`);
        const relatedRaw = res.related || [];

        const transformed = relatedRaw.map((p) => {
          const variant = p.variantOptions?.[0];
          const matchedSize = variant?.sizes?.[0];

          return {
            _id: variant && matchedSize ? `${p._id}-${variant._id}-${matchedSize._id}` : p._id,
            name: p.name || "Unnamed Product",
            description: p.description || "",
            brand: p.brand || "",
            images:
              variant?.color?.images?.map((img) => (typeof img === "string" ? img : img.url)) ||
              p.images ||
              [],
            variantColor: p.variantColor || "",
            variantColorHex: variant?.color?.hex || "",
            variantSize: p.variantSize || "",
            price: matchedSize?.price || p.price || 0,
            oldPrice: matchedSize?.oldPrice || p.oldPrice || 0,
            stock: matchedSize?.stock || p.stock || 0,
            rating: p.rating || 0,
            productId: p._id,
            variantId: variant?._id || "",
            sizeId: matchedSize?._id || "",
          };
        });

        setRelatedProducts(transformed);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    fetchRelatedProducts();
  }, [product]); // ✅ run whenever product is loaded


  useEffect(() => {
    (async () => {
      try {
        const res = await fetchDataFromApi("/api/address");
        const last = res.data;
        if (last.length > 0) {
          const addr = {
            phone: last[0].mobile || "",
            address: last[0].address_line || "",
            city: last[0].city || "",
            state: last[0].state || "",
            pincode: last[0].pincode || "",
            country: last[0].country || "",
          };
          setUserAddress(last[0]);
          setForm(addr);
          setOriginalForm(addr);
        }
      } catch (error) {
        // Optional: log in dev only
        if (import.meta.env.MODE !== "production") {
          // console.error("Failed to fetch address:", error);
        }
        // Optional: Show UI error
        // setError("Could not load address. Please login.");
      }
    })();
  }, []);


  const isAddressChanged = () => {
    if (!originalForm) return false;
    return Object.keys(form).some((key) => form[key] !== originalForm[key]);
  };

  const calculateDisplayPrice = () => {
    if (!selectedVariantSize) return product?.basePrice || 0;
    return selectedVariantSize.price || product?.basePrice || 0;
  };

  const displayPrice = calculateDisplayPrice();

  const handlePlaceOrder = async () => {
    try {
      if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
      }
      if (!product || !userAddress) return;
      setLoading(true);
      const payload = {
        products: [
          {
            productId: product._id,
            variantId: variantids,
            sizeId: selectedVariantSize._id,
            quantity,
            product_details: {
              name: product.name,
              image: selectedColor?.images?.map((img) => img.url) || product.images?.map((img) => img.url) || [],
              price: displayPrice,
              oldPrice: selectedSize?.oldPrice || null,
              color: selectedColor?.name,
              size: selectedVariantSize?.name,
            },
          },
        ],
        subTotalAmt: displayPrice * quantity,
        totalAmt: displayPrice * quantity,
        delivery_address: userAddress._id,
        payment_method: paymentMethod,
      };
      const res = await postData("/api/order/place", payload);
      if (res.success) {
        setShowModal(false);
        navigate("/order");
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressUpdate = async () => {
    try {
      setsaddress(false)
      const updatedAddress = {
        address_line: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: form.country,
        mobile: form.phone,
      };
      const res = await putData(`/api/address/${userAddress._id}`, updatedAddress);
      if (res.success) {
        setUserAddress({ ...userAddress, ...updatedAddress });
        setEditAddressMode(false);
        setOriginalForm({ ...form });
      } else {
        alert(res.message || "Failed to update address.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating address.");
    }
  };

  const handleBuyNow = () => {
    if (!userAddress) {
      setPopup({
        show: true,
        title: "Missing Address",
        message: "Please add a delivery address before proceeding.",
        onConfirm: () => {
          setPopup({ ...popup, show: false });
          navigate("/profile");
        }
      });
      return;
    }

    const requiredFields = [
      userAddress.address_line,
      userAddress.city,
      userAddress.state,
      userAddress.pincode,
      userAddress.country,
      userAddress.mobile,
    ];

    const areFieldsFilled = requiredFields.every(
      field => String(field).trim() !== ""
    );

    if (!areFieldsFilled) {
      setPopup({
        show: true,
        title: "Incomplete Address",
        message: "Please complete all address fields before placing the order.",
        onConfirm: () => {
          setPopup({ ...popup, show: false });
          navigate("/profile");
        }
      });
      return;
    }

    setShowModal(true);
  };


  useEffect(() => {
    if (!product?.variantOptions) return;
    let variant = product.variantOptions.find(
      (v) =>
        v.color.name === selectedColor?.name &&
        (selectedSize?.size?.name ? v.size.name === selectedSize.size.name : true)
    );
    if (!variant) {
      variant = product.variantOptions.find((v) => v.color.name === selectedColor?.name);
    }
    if (variant) {
      setSelectedSize(variant);
      setColorImages(variant.color.images || []);
      setActiveImage(0);
    } else {
      setColorImages(selectedColor?.images || []);
      setActiveImage(0);
    }
  }, [selectedColor, product]);

  useEffect(() => {
    if (!selectedSize) return;
    setSelectedColor(selectedSize.color);
    setColorImages(selectedSize.color.images || []);
    setActiveImage(0);
  }, [selectedSize]);

  if (!product) {
    return (
      <Loader />
    );
  }

  const handleAddToCart = async () => {
    if (!isAdding && !addedSuccess && product && selectedSize) {
      setIsAdding(true);
      const payload = {
        productId: product._id,
        variantId: selectedSize._id,
        sizeId: selectedVariantSize,
        quantity,
      };
      try {
        const res = await postData("/api/cart/add", payload);
        if (res.success) {
          setAddedSuccess(true);
        } else {
          alert("Failed to add to cart: " + (res.message || "Unknown error"));
        }
      } catch (error) {
        setPopup({
          show: true,
          title: "",
          message: "add already",
          onConfirm: () => setPopup({ ...popup, show: false }),
        });
      } finally {
        setIsAdding(false);
        setTimeout(() => setAddedSuccess(false), 2000);
      }
    }
  };



  return (
    <>
      {/* <div className="top-20 relative md:left-20 xs:float-right xs:right-5">
        <Md3dRotation className="text-4xl shadow-2xl rounded-full p-1 shadow-red-500" />
      </div> */}
      {product && (
        <Helmet>
          {/* ================= BASIC SEO ================= */}
          <title>
            {product.name} | Buy Online at Best Price | {product.brand}
          </title>

          <meta
            name="description"
            content={
              product.description
                ? `${product.description.slice(0, 160)}...`
                : `Buy ${product.name} by ${product.brand} at best price. Fast delivery across India.`
            }
          />

          <meta
            name="keywords"
            content={`${product.name}, ${product.brand}, ${product.catName}, ${product.subCatName}, buy ${product.name} online`}
          />

          {/* ================= CANONICAL ================= */}
          <link rel="canonical" href={window.location.href} />

          {/* ================= OPEN GRAPH (WHATSAPP / FB) ================= */}
          <meta property="og:type" content="product" />
          <meta property="og:title" content={product.name} />
          <meta
            property="og:description"
            content={product.description?.slice(0, 160)}
          />
          <meta property="og:image" content={colorImages?.[0]?.url} />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:site_name" content="YourStoreName" />

          {/* ================= TWITTER ================= */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={product.name} />
          <meta
            name="twitter:description"
            content={product.description?.slice(0, 160)}
          />
          <meta name="twitter:image" content={colorImages?.[0]?.url} />

          {/* ================= PRODUCT META ================= */}
          <meta property="product:brand" content={product.brand} />
          <meta
            property="product:availability"
            content={product.stock > 0 ? "in stock" : "out of stock"}
          />
          <meta
            property="product:price:amount"
            content={selectedVariantSize?.price || product.price}
          />
          <meta property="product:price:currency" content="INR" />

          {/* ================= GOOGLE STRUCTURED DATA ================= */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name,
              image: colorImages?.map((img) => img.url),
              description: product.description,
              brand: {
                "@type": "Brand",
                name: product.brand,
              },
              offers: {
                "@type": "Offer",
                url: window.location.href,
                priceCurrency: "INR",
                price: selectedVariantSize?.price || product.price,
                availability:
                  product.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
              },
            })}
          </script>
        </Helmet>
      )}



      <div className="max-w-6xl mx-auto p-6 mt-10">
        <div className="grid md:grid-cols-2 gap-8 p-4">
          {/* Left - Image Preview */}
          <div>
            {/* <div className="bg-gray-50 rounded-full  p-2 relative top-5 right-1">
            <IoMdHeart
                className="text-red-600 cursor-pointer transition duration-300 text-2xl"
              />
          </div> */}
          
            <img
              src={colorImages?.[activeImage]?.url}
              alt={product.name}
              className="w-full h-[400px] object-contain rounded-lg"
            />
            <div className="flex gap-2 mt-4 flex-wrap">
              {colorImages?.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  className={`w-16 h-16 cursor-pointer rounded border ${activeImage === i ? "border-black" : "border-gray-300"
                    }`}
                  onClick={() => setActiveImage(i)}
                />
              ))}
              
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-4">
          <div className="flex items-center">
            <h2 className="text-3xl font-bold">{product.name}</h2>
           <GoShareAndroid
                          className=" min-w-8 cursor-pointer text-3xl ml-5 bg-gray-200 p-1 rounded-full"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowShare(true);
                          }}
                        />
            </div>
            <div className="mt-4 text-xl font-semibold ">
              <span className="text-green-700">₹{displayPrice.toLocaleString()}</span>

              {selectedVariantSize?.oldPrice && selectedVariantSize.oldPrice > displayPrice && (
                <span className="ml-2 line-through text-gray-500 text-sm">
                  ₹{selectedVariantSize.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
            {selectedVariantSize?.oldPrice && selectedVariantSize.oldPrice > displayPrice && (
              <span className="ml-2 text-green-600 text-sm">
                {Math.round(((selectedVariantSize.oldPrice - displayPrice) / selectedVariantSize.oldPrice) * 100)}% OFF
              </span>
            )}



            <div className="text-sm  text-yellow-400">
              {'★'.repeat(Math.round(product.rating))}
            </div>
            {/* Colors */}
            {/* {product.variantOptions?.length > 0 && selectedVariantSize && (() => {
              const matchingColorVariants = product.variantOptions.filter((variant) => {
                return variant.sizes?.some(size =>
                  size?.name?.trim().toLowerCase() === selectedVariantSize?.name?.trim().toLowerCase()
                );
              });

              const uniqueColors = [];
              matchingColorVariants.forEach((variant) => {
                const color = variant.color;
                if (color && !uniqueColors.find((c) => c.name === color.name)) {
                  uniqueColors.push(color);
                }
              });

              const handleColorClick = (color) => {
                setSelectedColor(color);

                // Find the matching variant using color + selected size
                const matchedVariant = product.variantOptions.find(
                  (variant) =>
                    variant.color.name === color.name &&
                    variant.sizes?.some((s) =>
                      s.name?.trim().toLowerCase() === selectedVariantSize?.name?.trim().toLowerCase()
                    )
                );

                if (matchedVariant) {
                  setColorImages(matchedVariant.color.images || []);

                  // Find the correct size inside the matched variant
                  const matchedSize = matchedVariant.sizes.find(
                    (s) =>
                      s.name?.trim().toLowerCase() === selectedVariantSize?.name?.trim().toLowerCase()
                  );

                  if (matchedSize) {
                    setSelectedVariantSize(matchedSize); // optional: update size again
                    setPrice(matchedSize.price);         // ✅ Update price
                    setvariantid(matchedSize._id);       // ✅ Update variant ID
                  }
                }
              };

              
            })()} */}




            {/* Sizes */}
            {product.variantOptions?.[0]?.sizes?.[0]?.name && (
              <div className="mt-4">
                <h4 className="font-semibold"></h4>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {Array.from(
                    new Set(
                      product.variantOptions.flatMap(variant =>
                        variant.sizes.map(size => size.name)
                      )
                    )
                  ).map((sizeName, index) => {
                    // Is this size available for the current selectedColor?
                    const isAvailable = product.variantOptions.some(
                      variant =>
                        variant.color.name === selectedColor?.name &&
                        variant.sizes.some(s => s.name === sizeName)
                    );

                    const isSelected = selectedVariantSize?.name === sizeName;

                    return (
                      <button
                        key={index}
                        disabled={!isAvailable}
                        onClick={() => {
                          if (!isAvailable) return;

                          const matchingVariant = product.variantOptions.find(
                            v =>
                              v.color.name === selectedColor?.name &&
                              v.sizes.some(s => s.name === sizeName)
                          );

                          const matchedSize = matchingVariant?.sizes.find(s => s.name === sizeName);

                          if (matchedSize) {
                            setSelectedVariantSize(matchedSize);
                            setvariantid(matchedSize._id);
                            setSelectedSize(matchingVariant);
                          }
                        }}
                        className={`px-4 py-2 rounded border transition ${isSelected
                          ? "bg-gray-800 text-white"
                          : isAvailable
                            ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        {sizeName}
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500 mt-1">Selected: {selectedVariantSize?.name}</p>
              </div>
            )}
            {/* VARIANTS - COLORS & SIZES */}
            {product.variantOptions?.length > 0 && (
              <div className="mt-6 space-y-4">

                {/* Color Selection */}
                <div>
                  <h4 className="font-semibold">Colors</h4>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {(() => {
                      const uniqueColors = [];
                      product.variantOptions.forEach(variant => {
                        if (
                          variant.color &&
                          !uniqueColors.find(c => c.name === variant.color.name)
                        ) {
                          uniqueColors.push(variant.color);
                        }
                      });

                      return uniqueColors.map((color, index) => {
                        const isSelected = selectedColor?.name === color.name;

                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedColor(color);

                              // Pick first variant that matches this color
                              const matchedVariant = product.variantOptions.find(
                                v => v.color.name === color.name
                              );
                              const matchedSize = matchedVariant.sizes.find(
                                s => s.name === selectedVariantSize?.name
                              ) || matchedVariant.sizes[0];

                              setSelectedVariantSize(matchedSize);
                              setvariantid(matchedSize._id);
                              setPrice(matchedSize.price);
                              setColorImages(matchedVariant.color.images || []);
                              setActiveImage(0);
                            }}
                            className={`w-10 h-10 rounded-full border-2 overflow-hidden transition ${isSelected ? "border-green-700 border-3" : "border-gray-100"
                              }`}
                            title={color.name}
                          >
                            <img
                              src={
                                typeof color.images?.[0] === "string"
                                  ? color.images[0]
                                  : color.images?.[0]?.url
                              }
                              alt={color.name}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      });
                    })()}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {selectedColor?.name || "None"}
                  </p>
                </div>

                {/* Size Selection */}
                <div>
                  <h4 className="font-semibold">Sizes</h4>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {Array.from(
                      new Set(
                        product.variantOptions.flatMap(v => v.sizes.map(s => s.name))
                      )
                    ).map((sizeName, index) => {
                      const isSelected = selectedVariantSize?.name === sizeName;

                      // Check if this size exists for the currently selected color
                      const isAvailable = product.variantOptions.some(
                        v =>
                          v.color.name === selectedColor?.name &&
                          v.sizes.some(s => s.name === sizeName)
                      );

                      return (
                        <button
                          key={index}
                          disabled={!isAvailable}
                          onClick={() => {
                            if (!isAvailable) return;

                            // Find variant for selected color + size
                            const matchedVariant = product.variantOptions.find(
                              v =>
                                v.color.name === selectedColor?.name &&
                                v.sizes.some(s => s.name === sizeName)
                            );

                            const matchedSize = matchedVariant?.sizes.find(
                              s => s.name === sizeName
                            );

                            if (matchedVariant && matchedSize) {
                              setSelectedVariantSize(matchedSize);
                              setvariantid(matchedSize._id);
                              setPrice(matchedSize.price);
                              setColorImages(matchedVariant.color.images || []);
                              setActiveImage(0);
                            }
                          }}
                          className={`px-4 py-2 rounded border transition ${isSelected
                              ? "bg-gray-800 text-white"
                              : isAvailable
                                ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          {sizeName}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {selectedVariantSize?.name || "None"}
                  </p>
                </div>
              </div>
            )}

            {selectedVariantSize?.pcd && (
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-4">
                <p><strong>PCD:</strong> {selectedVariantSize.pcd}</p>
                <p><strong>CB:</strong> {selectedVariantSize.cb}</p>
                <p><strong>ET:</strong> {selectedVariantSize.et}</p>
                <p><strong>Hole Count:</strong> {selectedVariantSize.holeCount}</p>
                <p><strong>Width:</strong> {selectedVariantSize.width}</p>
              </div>
            )}


            {/* Compatibility */}
            {selectedVariantSize?.specificC?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Car Compatibility:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {selectedVariantSize.specificC.map((car, index) => (
                    <li key={index}>{car}</li>
                  ))}
                </ul>
              </div>
            )}


            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="border px-3 py-1 rounded"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="border px-3 py-1 rounded"
              >
                +
              </button>
            </div>

            {/* Actions */}

            <div>
              <span>In Stock: </span>
              <span className="text-sm">{selectedVariantSize?.stock ?? 0}</span>
            </div>
            <div className="flex gap-4 mt-6">




              {isSiteClosed ? (
                <button
                  disabled
                  className="bg-gray-500 text-white px-6 py-2 rounded cursor-not-allowed"
                >
                  Coming Soon
                </button>
              ) : selectedVariantSize?.stock === 0 ? (
                <button
                  disabled
                  className="bg-red-600 text-white px-6 py-2 rounded cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  onClick={handleBuyNow}
                  className={`px-6 py-2 rounded font-semibold text-white ${selectedVariantSize?.stock === 1 ? "bg-red-600" : "bg-green-600"
                    }`}
                >
                  Buy Now
                </button>
              )}


              <button
                onClick={handleAddToCart}
                disabled={isAdding || addedSuccess}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded font-semibold transition-all duration-300 ${addedSuccess
                  ? "bg-green-600 text-white"
                  : "bg-black text-gray-200 hover:bg-gray-900"
                  }`}
              >
                {isAdding ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                      ></path>
                    </svg>
                    Adding...
                  </>
                ) : addedSuccess ? (
                  <>
                    <svg
                      className="w-5 h-5 text-white animate-pingOnce"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Added!
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>


            </div>
          </div>
        </div>
        <div className="my-2 border-2 rounded-md p-5 border-black border-opacity-10">
          <h2 className="font-bold text-xl mb-2">Description</h2>

          <p
            className={`text-gray-600 whitespace-pre-wrap transition-all duration-300 ease-in-out ${showMore ? '' : 'line-clamp-none'
              }`}
          >
            {product.description}
          </p>

          {/* Show more/less toggle only if content is long */}
          {product.description?.split("\n").length > MAX_LINES && (
            <button
              className="text-blue-600 mt-2 font-medium hover:underline"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
        <ReviewForm productId={product?._id} />

        <div style={{ zIndex: "10", position: "relative" }}>
          <ProductReviewSection productId={product?._id} />
        </div>


        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 max-w-full mx-auto px-4 relative">
            <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-9 -ml-9">
              {relatedProducts.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}




        {/* Place Order Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex justify-center items-center z-50 p-3">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-auto max-h-[90vh] p-6 relative  scrollbar-hide">
              {/* Close Button */}
              {/* <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close modal"
              >
                &times;
              </button> */}

              {/* Modal Title */}
              <h3 className="text-lg font-bold mb-1 text-center">Confirm Your Order</h3>

              {/* Product Details */}
              <section className="mb-2 space-y-2 flex justify-between">
                <img src={selectedColor?.images?.[0].url} alt="" className="w-24 h-24 self-center" />
                <div>
                  <p><strong>Product:</strong> {product.name}</p>
                  <p><strong>Size:</strong> {selectedVariantSize.name || selectedSize?.name}</p>
                  <p><strong>Color:</strong> {selectedColor?.name}</p>
                  <p><strong>Quantity:</strong> {quantity}</p>
                  <p><strong>Price per item:</strong> ₹{displayPrice.toLocaleString()}</p>
                </div>
              </section>
              <p className="text-lg font-semibold bg-yellow-200 rounded-lg p-1 px-3 justify-between flex">
                <span>Total Price:</span>
                <span>₹{(displayPrice * quantity).toLocaleString()}</span>
              </p>

              {/* Quantity Selector */}
              <div className="flex justify-center items-center gap-3 mt-2 mb-6">
                Quantity:
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="w-10 h-10 border rounded hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border rounded hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <hr className="mb-6 border-gray-300" />

              {/* Payment Method */}
              <section className="mb-6">
                <h4 className="font-semibold mb-3">Select Payment Method</h4>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === " Cash on Delivery"}
                      onChange={() => setPaymentMethod(" Cash on Delivery")}
                      className="cursor-pointer"
                    />
                    Cash on Delivery
                  </label>
                </div>
              </section>
              {/* Delivery Address */}
              <section className="mb-6">
                <h4 className="font-semibold mb-3">Delivery Address</h4>
                {saddress === true ? null : (
                  <div>
                    <span>{form.address}, {form.city}, {form.state}, {form.country} - {form.pincode}</span>
                    <p className="pb-2">Phone: {form.phone}</p>
                    <span onClick={() => showaddress(true)} className="text-blue-300 cursor-pointer inline-flex items-center gap-1"> EditAddress
                      <LuPencil />
                    </span>
                  </div>
                )}

                {userAddress && saddress && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Address Line"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {isAddressChanged() && (
                      <div className="flex gap-3">
                        <button
                          onClick={handleAddressUpdate}
                          disabled={loading}
                          className="flex-1 bg-green-600 text-white py-3 rounded transition transform active:scale-95 hover:bg-green-700 disabled:opacity-50"
                        >
                          Save Address
                        </button>

                        <button
                          onClick={() => {
                            setForm(originalForm);
                            setEditAddressMode(false);
                          }}
                          className="flex-1 border border-gray-400 py-3 rounded hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </section>


              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="px-6 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-gray-900 disabled:opacity-50"
                >
                  {loading ? "Placing order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {popup.show && (
        <ConfirmModal
          title={popup.title}
          message={popup.message}
          onConfirm={popup.onConfirm}
          onCancel={() => setPopup({ ...popup, show: false })}
        />
      )}
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

export default ProductShow;
