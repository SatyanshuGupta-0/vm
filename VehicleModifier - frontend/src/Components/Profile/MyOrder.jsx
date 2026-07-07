import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchDataFromApi, putData } from "../../utils/api";
import Loader from "../Loader";

// Utility to generate SEO slug
const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("accesstoken");
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setAuthLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetchDataFromApi("/api/order/user-orders");
        setOrders(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading]);

  const confirmCancel = (orderId) => {
    setSelectedOrderId(orderId);
    setShowPopup(true);
  };

  const handleCancelOrder = async () => {
    try {
      await putData(`/api/order/cancel/${selectedOrderId}`);
      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === selectedOrderId ? { ...ord, status: "Cancelled" } : ord
        )
      );
    } catch (err) {
      console.error("Cancel failed", err);
    } finally {
      setShowPopup(false);
      setSelectedOrderId(null);
    }
  };

  // Generate SEO-friendly product URL
  const getProductUrl = (item) => {
    const product = item.productId || {};
    const variantId = item.variantId;
    const sizeId = item.sizeId;

    const urlParams = new URLSearchParams();
    if (sizeId) urlParams.append("size", sizeId);
    if (variantId) urlParams.append("variant", variantId);

    const slug = slugify(`${product.brand || ""} ${product.name || ""}`);
    return `/product/${slug}${urlParams.toString() ? "?" + urlParams.toString() : ""}`;
  };
  

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <>
      <div className="p-4 md:p-8 mt-10">
        <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const isCancelled = order.status === "Cancelled";

              return (
                <div key={order._id} className="relative border rounded-lg shadow-sm p-4">
                  {isCancelled && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      <div className="bg-white/90 text-red-600 text-lg font-semibold px-4 py-2 rounded shadow">
                        Cancelled
                      </div>
                    </div>
                  )}

                  <div className={`relative ${isCancelled ? "opacity-60 pointer-events-none select-none" : ""}`}>
                    <div className="space-y-4">
                      {order.products.map((item, idx) => {
                        const product = item.productId || {};
                        const details = item.product_details || {};
                        const quantity = item.quantity || 1;
                        const unitPrice = details.price || 0;
                        const oldPrice = details.oldPrice || null;
                        const totalAmount = unitPrice * quantity;

                        return (
                          <div key={idx} className="flex md:flex-row items-start md:items-center gap-4">
                            <img
                              src={details.image?.[0] || product.images?.[0]?.url || "/placeholder.png"}
                              alt={details.name || product.name}
                              className="w-24 h-24 object-cover rounded-lg border"
                            />
                            <div className="flex-1">
                              <h2 className="text-lg font-medium">{details.name || product.name}</h2>
                              {details.color && <p className="text-sm text-gray-500">Color: {details.color}</p>}
                              {details.size && <p className="text-sm text-gray-500">Size: {details.size}</p>}
                              {oldPrice && oldPrice > unitPrice && (
                                <p className="text-sm text-green-600">
                                  ({Math.round(((oldPrice - unitPrice) / oldPrice) * 100)}% OFF)
                                </p>
                              )}
                              <p className="text-sm text-gray-500">Qty: {quantity}</p>
                              <p className="text-sm text-gray-500">
                                Total: <span className="text-green-600">₹{totalAmount.toLocaleString()}</span>
                              </p>
                              <p className="text-sm text-gray-500">
                                Ordered On: {new Date(order.createdAt).toLocaleDateString()}
                              </p>

                              <div className="flex flex-wrap gap-2 mt-2">
                                {!isCancelled && (
                                  <Link to={`/details/${order._id}/${product._id}`}>
                                    <button className="px-4  border-2 text-black border-yellow-600 font-medium rounded-lg hover:bg-yellow-100">
                                      View Details
                                    </button>
                                  </Link>
                                )}

                                <Link to={getProductUrl(item)}>
                                  <button className="px-4 border-2 text-black border-blue-600 font-medium rounded-lg hover:bg-blue-100">
                                    View Product
                                  </button>
                                </Link>

                                {!isCancelled && order.status !== "Delivered" && (
                                  <button
                                    onClick={() => confirmCancel(order._id)}
                                    className="px-4  border-2 text-black border-red-600 font-medium rounded-lg hover:bg-red-100"
                                  >
                                    Cancel Order
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">You have no orders yet.</p>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4 w-[90%] max-w-sm">
            <h2 className="text-xl font-semibold">Cancel this order?</h2>
            <p className="text-gray-600 text-sm">Are you sure you want to cancel this order?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-200 text-black rounded"
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Order;
