import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { fetchDataFromApi, putData } from "../utils/api";

const NewOrderTable = () => {
  const ORDERS_PER_PAGE = 6;
  const [orders, setOrders] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  // or wherever you store it
  // Declare outside component or at top inside your component
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No token found");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await fetchDataFromApi("/api/order/all-orders", config);
      const ordersData = res.data || [];

      const enrichedOrders = await Promise.all(
        ordersData.map(async (order) => {
          let userEmail = "—";
          let userName = "—";

          if (order.userId) {
            try {
              const userRes = await fetchDataFromApi(
                `/api/user/${order.userId}`,
                config
              );
              userEmail = userRes?.user?.email || "—";
              userName = userRes?.user?.name || "—";
            } catch (err) {
              console.warn(`Failed to fetch user info for user ${order.userId}`, err);
            }
          }

          return {
            ...order,
            address: order.delivery_address,
            userEmail,
            userName,
          };
        })
      );

      setOrders(enrichedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [])

  const handleStatusUpdate = async (orderId, field, value) => {
    try {
      const payload = {};
      payload[field] = value;

      const res = await putData(`/api/order/updateStatus/${orderId}`, payload);

      alert("Order updated successfully ✅");

      // Optional: update UI or refetch orders
      console.log("Updated order:", res);
    } catch (err) {
      console.error("Error updating order:", err);
      alert("❌ Failed to update order. Please try again.");
    }
  };


  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order._id?.toLowerCase().includes(term) ||
      order.paymentId?.toLowerCase().includes(term) ||
      order.status?.toLowerCase().includes(term) ||
      order.userEmail?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const toggleExpand = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="mx-3 border-2 border-black border-opacity-10 rounded-lg">
      <h3 className="p-3 text-xl font-bold">Recent Orders</h3>

      {/* Search Bar */}
      <div className="px-4 pt-2 pb-4">
        <input
          type="text"
          placeholder="Search by Order ID, Payment ID, Status, or User Email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>


      <div className="relative mx-3 mb-3 overflow-x-auto shadow-md sm:rounded-lg border-2 border-black border-opacity-10">
        <table className="w-full text-sm text-left text-black">
          <thead className="text-xs uppercase bg-[#f1f1f1]">
            <tr>
              <th className="px-6 py-3"> </th>
              <th className="px-6 py-3">ORDER ID</th>
              <th className="px-6 py-3">PAYMENT ID</th>
              <th className="px-6 py-3">PAYMENT STATUS</th>
              <th className="px-6 py-3">PAYMENT METHOD</th>
              <th className="px-6 py-3">PRODUCT NAME</th>
              <th className="px-6 py-3">PHONE</th>
              <th className="px-6 py-3">ADDRESS</th>
              <th className="px-6 py-3">PINCODE</th>
              <th className="px-6 py-3">AMOUNT</th>
              <th className="px-6 py-3">EMAIL</th>
              <th className="px-6 py-3">USER NAME</th>
              <th className="px-6 py-3">USER ID</th>
              <th className="px-6 py-3">STATUS</th>
              <th className="px-6 py-3">DATE</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => {
              let statusColor = "";
              switch (order.status) {
                case "Delivered":
                  statusColor = "bg-green-100 text-green-800";
                  break;
                case "Cancelled":
                  statusColor = "bg-red-100 text-red-800";
                  break;
                case "RefundRequested":
                  statusColor = "bg-blue-200 text-blue-800";
                  break;
                default:
                  statusColor = "bg-yellow-100 text-yellow-800";
              }

              return (
                <React.Fragment key={order._id}>
                  <tr className={`border-b-2 border-gray-300 ${statusColor}`}>
                    <td className="px-6 py-4 cursor-pointer" onClick={() => toggleExpand(order._id)}>
                      {expandedRows[order._id] ? <FaAngleDown /> : <FaAngleUp />}
                    </td>
                    <td className="px-6 py-4">{order._id}</td>
                    <td className="px-6 py-4">{order.paymentId || "—"}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.payment_status}
                        onChange={(e) => handleStatusUpdate(order._id, "payment_status", e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="">Select Payment Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">{order.payment_method || "—"}</td>
                    <td className="px-6 py-4">{order.products?.[0]?.product_details?.name || "—"}</td>
                    <td className="px-6 py-4">{order.address?.mobile || "—"}</td>
                    <td className="px-6 py-4 w-40">
                      {order.address ? (
                        <p className="w-40">
                          {order.address.address_line || ""}, {order.address.city || ""}, {order.address.state || ""}, {order.address.country || ""} - {order.address.pincode || ""}
                        </p>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4">{order.address?.pincode || "—"}</td>
                    <td className="px-6 py-4">₹{order.subTotalAmt ?? order.totalAmt ?? "—"}</td>
                    <td className="px-6 py-4">{order.userEmail}</td>
                    <td className="px-6 py-4">{order.userName}</td>
                    <td className="px-6 py-4">{order.userId || "—"}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, "status", e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="">Select Order Status</option>
                        <option value="Placed">Placed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out-for-Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="RefundRequested">Refund Requested</option>
                        <option value="Refunded"> Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>

                  {expandedRows[order._id] && (
                    <tr className="bg-gray-50">
                      <td colSpan={15} className="p-4">
                        <table className="w-full text-sm text-left text-black border border-gray-300 rounded">
                          <thead className="text-xs uppercase bg-[#f4f3f3]">
                            <tr>
                              <th className="px-6 py-3">PRODUCT ID</th>
                              <th className="px-6 py-3">Variant ID</th>
                              <th className="px-6 py-3">TITLE</th>
                              <th className="px-6 py-3">IMAGE</th>
                              <th className="px-6 py-3">QTY</th>
                              <th className="px-6 py-3">COLOR</th>
                              <th className="px-6 py-3">Size</th>
                              <th className="px-6 py-3">BRAND</th>
                              <th className="px-6 py-3">PRICE</th>
                              <th className="px-6 py-3">SUBTOTAL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.products?.map((item, idx) => {
                              const qty = item.quantity ?? 1;
                              const orderAmt = order.subTotalAmt ?? order.totalAmt ?? 0;
                              const pricePerUnit = Math.floor(orderAmt / qty);

                              return (
                                <tr key={idx} className="border-b">
                                  <td className="px-6 py-3">{item.productId?._id || "N/A"}</td>
                                  <td className="px-6 py-3">{item.variantId || "N/A"}</td>
                                  <td className="px-6 py-3">{item.product_details?.name || "N/A"}</td>
                                  <td className="px-6 py-3">
                                    {item.product_details?.image?.[0] ? (
                                      <img
                                        src={item.product_details.image[0]}
                                        alt="Product"
                                        className="w-12 h-12 object-cover"
                                      />
                                    ) : (
                                      "—"
                                    )}
                                  </td>
                                  <td className="px-6 py-3">{qty}</td>
                                  <td className="px-6 py-3">{item.product_details?.color || "—"}</td>
                                  <td className="px-6 py-3">{item.product_details?.size || "—"}</td>
                                  <td className="px-6 py-3">{item.productId?.brand || "—"}</td>
                                  <td className="px-6 py-3">₹{pricePerUnit}</td>
                                  <td className="px-6 py-3">₹{orderAmt}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>


      {totalPages > 1 && (
        <div className="flex justify-end items-center my-4 mx-4 gap-4">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NewOrderTable;

