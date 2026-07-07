import React, { useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi, deleteData, putData, postData } from "../../utils/api";
import Loader from "../Loader";

// Utility to generate SEO slug
const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState({});
  const [userAddress, setUserAddress] = useState(null);
  const [form, setForm] = useState({ address: "", city: "", state: "", pincode: "", country: "", phone: "" });
  const [editMode, setEditMode] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetchDataFromApi("/api/cart/get");
        setCart(res.data);
      } catch (error) {
        alert("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };
    const fetchAddress = async () => {
      try {
        const res = await fetchDataFromApi("/api/address");
        const addr = res?.data?.[0];
        if (addr) {
          setUserAddress(addr);
          setForm({
            address: addr.address_line,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            country: addr.country,
            phone: addr.mobile,
          });
        }
      } catch (err) {
        console.error("Failed to load address.", err);
      }
    };
    fetchCart();
    fetchAddress();
  }, []);

  const removeFromCart = async (item) => {
    setLoadingItems((prev) => ({ ...prev, [item._id]: true }));
    try {
      await deleteData(`/api/cart/delete-cart-item/${item._id}`);
      setCart((prev) => prev.filter((c) => c._id !== item._id));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      alert("Failed to remove item. Please try again.");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item._id]: false }));
    }
  };

  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1) return;
    setLoadingItems((prev) => ({ ...prev, [item._id]: true }));
    try {
      await putData(`/api/cart/update-qty`, {
        _id: item._id,
        qty: newQty,
      });
      setCart((prev) =>
        prev.map((c) =>
          c._id === item._id ? { ...c, quantity: newQty } : c
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity. Please try again.");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item._id]: false }));
    }
  };

  const findVariant = (item) => {
    return item.productId?.variantOptions?.find(
      (v) => v._id === item.variantId
    );
  };

  // Generate SEO-friendly product URL
  const getProductUrl = (item) => {
    const product = item.productId;
    const variant = findVariant(item);
    const size = variant?.sizes?.find((s) => s._id === item.sizeId);

    const urlParams = new URLSearchParams();
    if (variant?.color?.name) urlParams.append("color", variant.color.name);
    if (size?.name) urlParams.append("size", size.name);
    if (size?.width) urlParams.append("width", size.width);
    if (size?.pcd) urlParams.append("pcd", size.pcd);
    if (size?.cb) urlParams.append("cb", size.cb);

    const slug = slugify(`${product.brand || ""} ${product.name || ""}`);
    return `/product/${slug}${urlParams.toString() ? "?" + urlParams.toString() : ""}`;
  };

  const subtotal = cart.reduce((sum, item) => {
    const variant = findVariant(item);
    const size = variant?.sizes?.find((s) => s._id === item.sizeId);
    const quantity = item.quantity || 1;
    const price = size?.price || variant?.price || 0;
    return sum + price * quantity;
  }, 0);

  const originalTotal = cart.reduce((sum, item) => {
    const variant = findVariant(item);
    const size = variant?.sizes?.find((s) => s._id === item.sizeId);
    const quantity = item.quantity || 1;
    const originalPrice = size?.oldPrice || size?.price || variant?.oldPrice || variant?.price || 0;
    return sum + originalPrice * quantity;
  }, 0);

  const discountAmount = originalTotal - subtotal;

  const handlePlaceOrder = async () => {
    if (!userAddress || !cart.length) return;
    setPlacingOrder(true);

    try {
      for (const item of cart) {
        const variant = findVariant(item);
        const size = variant?.sizes?.find(s => s._id === item.sizeId);

        const product = {
          productId: item.productId._id,
          variantId: item.variantId,
          sizeId: size._id,
          quantity: item.quantity,
          product_details: {
            name: item.productId.name,
            image: variant?.color?.images?.[0]?.url || item.productId.images?.[0]?.url || "",
            price: size?.price || variant?.price || 0,
            oldPrice: size?.oldPrice || null,
            color: variant?.color?.name,
            size: size?.name || "",
          },
        };

        const totalAmt = product.product_details.price * product.quantity;

        const payload = {
          products: [product],
          subTotalAmt: totalAmt,
          totalAmt,
          delivery_address: userAddress._id,
          payment_method: "Cash on Delivery",
        };

        const res = await postData("/api/order/place", payload);

        if (!res.success) {
          alert(`Order failed for product: ${item.productId.name}`);
          continue;
        }
      }

      try {
        await deleteData("/api/cart/clear");
      } catch (err) {
        console.warn("Failed to clear cart");
      }

      setCart([]);
      navigate("/order");
    } catch (err) {
      console.error(err);
      alert("Some orders may have failed. Please check.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const updateAddress = async () => {
    try {
      const updated = {
        address_line: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: form.country,
        mobile: form.phone
      };
      const res = await putData(`/api/address/${userAddress._id}`, updated);
      if (res.success) {
        setUserAddress({ ...userAddress, ...updated });
        setEditMode(false);
        alert("Address updated.");
      }
    } catch (err) {
      alert("Failed to update address.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 md:p-8 mt-10">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

      {cart.length > 0 ? (
        <>
          <div className="space-y-4">
            {cart.map((item) => {
              const product = item.productId;
              const variant = findVariant(item);
              if (!variant) {
                return (
                  <div key={item._id} className="p-4 border rounded text-center">
                    <p className="text-red-500">Variant not found for this item.</p>
                  </div>
                );
              }

              const quantity = item.quantity || 1;
              const selectedSize = variant.sizes?.find((s) => s._id === item.sizeId);
              const sizeName = selectedSize?.name || "N/A";
              const sizePrice = selectedSize?.price || variant.price || 0;
              const sizeOldPrice = selectedSize?.oldPrice || variant.oldPrice || sizePrice;
              const isDiscounted = sizeOldPrice > sizePrice;
              const imageUrl = variant.color?.images?.[0]?.url || variant.images?.[0]?.url || product?.images?.[0]?.url || "/placeholder.png";
              const color = variant.color?.name || "N/A";
              const isLoading = loadingItems[item._id] || false;

              return (
                <div
                  key={item._id}
                  className="border rounded-lg shadow-sm p-4 flex flex-col md:flex-row items-start md:items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={imageUrl}
                      alt={`${product?.name} - ${color} - ${sizeName}`}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <div>
                      <h2 className="text-lg font-medium">{product?.name}</h2>
                      <p className="text-sm text-gray-600">Color: {color}</p>
                      <p className="text-sm text-gray-600">Size: {sizeName}</p>
                      <p className="text-sm text-gray-500">
                        Price: {isDiscounted ? <span className="text-green-600">₹{sizePrice}</span> : <>₹{sizePrice}</>}
                      </p>
                      <p className="text-sm text-gray-500">Quantity: {quantity}</p>
                      <button
                        onClick={() => navigate(getProductUrl(item))}
                        className="mt-2 text-sm text-blue-600 border-2 rounded-md p-2 hover:bg-blue-800 hover:text-white transition"
                        disabled={isLoading}
                      >
                        View Product
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex flex-row lg:flex-col-reverse items-center justify-between gap-4 md:w-auto">
                    <div className="flex border rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item, quantity - 1)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                        disabled={quantity <= 1 || isLoading}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-white">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, quantity + 1)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                        disabled={isLoading}
                      >
                        +
                      </button>
                    </div>

                    <IoMdTrash
                      onClick={() => removeFromCart(item)}
                      className={`text-gray-500 text-2xl cursor-pointer hover:scale-110 transition ml-4 lg:ml-0 lg:mt-4 xl:ml-0 xl:mt-0 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      title="Remove from Cart"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary & Address */}
          <div className="border-t pt-6 mt-6 space-y-4">
            <div className="text-right space-y-2">
              <p className="text-sm flex justify-between">
                <span>Original Price: </span>
                <span className="line-through">₹{originalTotal.toFixed(2)}</span>
              </p>
              <p className="text-sm flex justify-between">
                <span>You Save: </span>
                <span className="font-medium text-green-500">₹{discountAmount.toFixed(2)}</span>
              </p>
              <h3 className="text-lg bg-green-100 flex justify-between p-2 rounded-md">
                <span>Total:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </h3>
            </div>

            {/* Address Section */}
            <div className="border-t mt-6 pt-4">
              <h2 className="text-md font-semibold mb-2">Delivery Address</h2>
              {!editMode ? (
                <>
                  <p>{form.address}, {form.city}, {form.state} - {form.pincode}</p>
                  <p>{form.country}, Phone: {form.phone}</p>
                  <button onClick={() => setEditMode(true)} className="text-blue-500 underline mt-2">Edit Address</button>
                </>
              ) : (
                <div className="grid gap-3">
                  <input type="text" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  <input type="text" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  <input type="text" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                  <input type="text" placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                  <input type="text" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                  <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <div className="flex gap-3">
                    <button onClick={updateAddress} className="bg-green-500 text-white p-2 rounded">Save</button>
                    <button onClick={() => setEditMode(false)} className="bg-gray-300 p-2 rounded">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="bg-blue-600 mt-6 w-full text-white py-3 rounded hover:bg-blue-700"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>

          <div className="flex mt-6 flex-col md:flex-row gap-4 justify-end">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Continue Shopping
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold text-gray-600">Your Cart is Empty</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white p-2 rounded-lg mt-4 hover:bg-blue-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
