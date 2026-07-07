import React, { useEffect, useState } from "react";
import { fetchDataFromApi, formatTimeAgo, deleteData, putData } from "../utils/api";

const ProductReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [modalMedia, setModalMedia] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const accessToken = localStorage.getItem("accesstoken");

  // Fetch current user details
  useEffect(() => {
    if (!accessToken) return;

    const fetchUser = async () => {
      try {
        const res = await fetchDataFromApi("/api/user/user-details", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res?.data) {
          setUser(res.data);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUser();
  }, [accessToken]);

  // Fetch reviews for product
  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetchDataFromApi(`/api/review/product/${productId}`);
        setReviews(Array.isArray(res) ? res : res?.data || []);
      } catch (err) {
        console.error("Error loading reviews:", err);
        setReviews([]);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [productId]);

  const handleDelete = async (reviewId) => {
    try {
      await deleteData(`/api/review/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditedText(review.reviewText);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditedText("");
  };

  const handleSaveEdit = async (reviewId) => {
    setSaving(true);
    try {
      const res = await putData(
        `/api/review/${reviewId}`,
        { reviewText: editedText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res?.status === 200 || res?.data?.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId ? { ...r, reviewText: editedText } : r
          )
        );
        setEditingReviewId(null); // Exit edit mode after save
        setEditedText("");
      }
    } catch (err) {
      console.error("Error saving edited review:", err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  const visibleReviews = reviews.slice(0, visibleCount);
  const openModal = (url, type) => setModalMedia({ url, type });
  const closeModal = () => setModalMedia(null);

  return (
    <div className="mt-12 relative z-0">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

      {loading ? (
        <p>Loading reviews...</p>
      ) : visibleReviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <>
          <div className="space-y-4">
            {visibleReviews.map((review) => (
              <div key={review._id} className="border p-4 rounded">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={review.userId?.avatar?.url || "/default-avatar.png"}
                      alt=""
                      className="w-10 h-10 rounded-full border-2 object-cover"
                    />
                    <div className="px-2">
                      <p className="text-sm text-gray-500">
                        {review.userId?.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTimeAgo(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  {user && user._id === review.userId?._id && (
                    <div className="flex gap-2">
                      
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex text-yellow-500 mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                  ))}
                </div>

                {editingReviewId === review._id ? (
                  <div className="mt-2">
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={async () => await handleSaveEdit(review._id)}
                        disabled={saving}
                        className={`px-3 py-1 ${
                          saving
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                        } text-white rounded`}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>

                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 mt-2">{review.reviewText}</p>
                )}

                {Array.isArray(review.media) && review.media.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {review.media.map((item, idx) => (
                      <div
                        key={idx}
                        className="w-24 h-24 cursor-pointer"
                        onClick={() => openModal(item.url, item.type)}
                      >
                        {item.type === "video" ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover rounded"
                            muted
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt="Review media"
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {visibleCount < reviews.length && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Show More Reviews
              </button>
            </div>
          )}
        </>
      )}

      {modalMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
          style={{ zIndex: 9999 }}
          onClick={closeModal}
        >
          <div className="max-w-2xl max-h-[90vh] p-4 bg-white rounded shadow relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-red-600 text-xl font-bold"
            >
              ×
            </button>

            {modalMedia.type === "video" ? (
              <video
                src={modalMedia.url}
                controls
                autoPlay
                className="w-full max-h-[80vh] rounded"
              />
            ) : (
              <img
                src={modalMedia.url}
                alt="Full media"
                className="w-full max-h-[80vh] object-contain rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviewSection;
