import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import  Loader  from '../Loader';
import RefundEligibility from "./refundEligibility";

const MAX_LINES = 1;

const stages = ["Order Placed", "Shipped", "In Transit", "Out for Delivery", "Delivered"];

const ViewDetails = () => {
  const { orderId, productId } = useParams(); // ✅ Get both from URL
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!orderId || !productId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchDataFromApi("/api/order/user-orders");

        const matchedOrder = response.data.find((ord) => ord._id === orderId);
        if (!matchedOrder) {
          setError("Order not found.");
          return;
        }

        const matchedProduct = matchedOrder.products.find(
          (p) => p.productId._id === productId
        );
        if (!matchedProduct) {
          setError("Product not found in this order.");
          return;
        }

        setOrder({ ...matchedOrder, selectedProduct: matchedProduct });
        setAddress(matchedOrder.delivery_address);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [orderId, productId]);

  if (loading) return <Loader />
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>
  if (!order) return <div className="p-8 text-center text-gray-600">No order found.</div>


  const productItem = order.selectedProduct;
  const product = productItem?.productId || {};
  const quantity = productItem?.quantity || 1;
  const productDetails = productItem.product_details || {};
  const price = productDetails.price || 0;
  const oldPrice = productDetails.oldPrice || null;
  const discountPercent = oldPrice && oldPrice > price
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null;

  const totalAmount = quantity * price;
  const totalSavings = oldPrice && oldPrice > price ? (oldPrice - price) * quantity : 0;
  const currentStage = Math.max(stages.indexOf(order.status || "Order Placed"), 0);

  const productImage = productDetails.image?.[0] || product.images?.[0] || "/placeholder.png";

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4 flex items-center">
        <button onClick={() => navigate("/")} className="hover:underline text-blue-500">Home</button>
        <span className="mx-2">/</span>
        <button onClick={() => navigate(-1)} className="hover:underline text-blue-500">Back</button>
        <span className="mx-2">/</span>
        <span className="font-semibold">{productDetails.name || product.name}</span>
      </div>

      {/* Product Info Card */}
      <div className="border border-gray-300 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-start">
          <div className="w-full md:w-1/3 flex items-center justify-center">
            <img src={productImage} alt={product.name} className="object-cover rounded-lg shadow-md max-h-80" />
          </div>

          <div className="w-full md:w-2/3 md:pl-6 mt-4 md:mt-0">
            <h1 className="text-2xl font-bold mb-2">{productDetails?.name || product?.name}</h1>

            {productDetails?.color && (
              <p className="text-sm text-gray-500">Color: {productDetails.color}</p>
            )}
            {productDetails?.size && (
              <p className="text-sm text-gray-500">Size: {productDetails.size}</p>
            )}

            <div className="my-2 border-2 rounded-md p-2 border-black border-opacity-10">
              <h2 className="font-bold text-xl mb-2">Description</h2>
              <p className={`text-gray-600 whitespace-pre-wrap transition-all duration-300 ease-in-out ${showMore ? '' : 'line-clamp-2'}`}>
                {product.description}
              </p>
              {product.description?.split("\n").length > MAX_LINES && (
                <button
                  className="text-blue-600 mt-2 font-medium hover:underline"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Show Less" : "Show More"}
                </button>
              )}
            </div>

            <div className="grid gap-4">
              <div className="flex gap-5">
                <div>
                  <h2 className="text-lg font-semibold">Status</h2>
                  <p className={`font-medium ${order.status === "Delivered" ? "text-green-600" : "text-yellow-600"}`}>
                    {order.status}
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Payment</h2>
                  <p className="font-medium text-gray-600">{order.payment_method}</p>
                </div>
              </div>

              {discountPercent && (
                <span className="text-green-600 text-sm">{discountPercent}% OFF</span>
              )}

              <div>
                <h2 className="text-lg font-semibold">Quantity</h2>
                <p className="text-gray-800">{quantity}</p>
              </div>

              {totalSavings > 0 && (
                <div>
                  <h2 className="text-lg font-semibold">You Saved:</h2>
                  <p className="text-green-700">₹{totalSavings.toFixed(2)} on this order</p>
                </div>
              )}

              <div className="flex justify-between items-center mt-4 bg-yellow-100 border border-yellow-400 rounded-lg p-4 text-lg font-bold text-gray-800">
                <p>Total Amount:</p>
                <p className="text-right">₹{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Progress */}
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Delivery Progress</h2>
        <div className="relative flex items-center justify-between">
          <div className="absolute top-4 left-4 right-4 h-1 bg-gray-300 z-0"></div>
          <div
            className="absolute top-4 left-4 h-1 bg-green-500 z-10 transition-all duration-300"
            style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
          ></div>
          {stages.map((stage, index) => (
            <div key={index} className="relative z-20 flex flex-col items-center w-full">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index <= currentStage ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                {index + 1}
              </div>
              <p className={`mt-2 text-center text-xs md:text-sm ${index <= currentStage ? "text-black font-medium" : "text-gray-500"}`}>
                {stage}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      {address && (
        <div className="mt-8 border rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold mb-2">Delivery Address</h3>
          <p>{address.address_line}</p>
          <p>{address.city}, {address.state} - {address.pincode}</p>
          <p>{address.country || "India"}</p>
          <p>Mobile: {address.mobile || "N/A"}</p>
        </div>
      )}

      {/* Billing Summary */}
      <div className="mt-8 border rounded-lg p-6 shadow">
        <h3 className="text-xl font-semibold mb-4">Billing Summary</h3>
        <div className="space-y-3 text-gray-800">
          <div className="flex justify-between">
            <p className="font-medium">Subtotal:</p>
            <p className="text-right">₹{totalAmount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">GST:</p>
            <p className="text-right">₹{order.gstAmt?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Tax:</p>
            <p className="text-right">₹{order.taxAmt?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Shipping:</p>
            <p className="text-right">₹{order.shippingCharges?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="flex justify-between items-center mt-4 bg-yellow-100 border border-yellow-400 rounded-lg p-4 text-lg font-bold text-gray-800">
            <p>Total Amount:</p>
            <p className="text-right">₹{ totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
            {/* Refund Section */}
      {order.status === "Delivered" && order.deliveredAt && (
        <RefundEligibility orderId={order._id} />
      )}

    </div>
  );
};

export default ViewDetails;
