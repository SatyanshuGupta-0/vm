import { useEffect, useState, useRef } from "react";
import {
  fetchDataFromApi,
  postData,
  putData,
  deleteData,
} from "../utils/api";
import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function BannerManager() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [banners, setBanners] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [existingMedia, setExistingMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetchDataFromApi("/api/banner");
      setBanners(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
      alert("Failed to load banners");
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    fileRef.current.value = "";
  };

  const removeExistingMedia = async (public_id, type) => {
    try {
      await postData("/api/banner/removeImage", { public_id, type });
      setExistingMedia((prev) => prev.filter((m) => m.public_id !== public_id));
    } catch (err) {
      console.error("Failed to remove media", err);
      alert("Failed to remove media from Cloudinary");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const uploaded = await Promise.all(
        selectedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", UPLOAD_PRESET);

          const isVideo = file.type.startsWith("video/");
          const endpoint = isVideo ? "video/upload" : "image/upload";

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${endpoint}`,
            formData
          );

          return {
            url: res.data.secure_url,
            public_id: res.data.public_id,
            type: isVideo ? "video" : "image",
          };
        })
      );

      const allMedia = [...existingMedia, ...uploaded];

      if (editingId) {
        await putData(`/api/banner/${editingId}`, { image: allMedia });
        alert("Banner updated");
      } else {
        await postData("/api/banner", { image: allMedia });
        alert("Banner added");
      }

      setSelectedFiles([]);
      setEditingId(null);
      setExistingMedia([]);
      fetchBanners();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to upload or save banner");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingId(banner._id);
    setExistingMedia(banner.image);
    setSelectedFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const bannerToDelete = banners.find((b) => b._id === id);
    if (!bannerToDelete) return alert("Banner not found.");

    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      for (const media of bannerToDelete.image) {
        if (media.public_id) {
          await postData("/api/banner/removeImage", {
            public_id: media.public_id,
            type: media.type,
          });
        }
      }
      await deleteData(`/api/banner/${id}`);
      alert("Banner and media deleted");
      fetchBanners();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete banner");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? "Edit" : "Upload"} Banner
      </h2>

      <input
        type="file"
        multiple
        accept="image/*,video/*"
        ref={fileRef}
        onChange={handleFileSelect}
        className="mb-4"
      />

      {existingMedia.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 font-medium text-gray-700">Existing Media:</p>
          <div className="flex gap-4 flex-wrap">
            {existingMedia.map((media, idx) => (
              <div key={idx} className="relative">
                {media.type === "video" ? (
                  <video
                    src={media.url}
                    controls
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={`existing-${idx}`}
                    className="w-32 h-32 object-cover rounded"
                  />
                )}
                <button
                  onClick={() => removeExistingMedia(media.public_id, media.type)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 font-medium text-gray-700">Preview:</p>
          <div className="flex gap-4 flex-wrap">
            {selectedFiles.map((file, idx) => {
              const url = URL.createObjectURL(file);
              return file.type.startsWith("video/") ? (
                <video
                  key={idx}
                  src={url}
                  controls
                  className="w-32 h-32 object-cover rounded"
                />
              ) : (
                <img
                  key={idx}
                  src={url}
                  alt={`preview-${idx}`}
                  className="w-32 h-32 object-cover rounded"
                />
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`px-6 py-2 rounded mb-8 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading
          ? editingId
            ? "Updating..."
            : "Uploading..."
          : editingId
          ? "Update Banner"
          : "Add Banner"}
      </button>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-4">Existing Banners</h3>
      {banners.length === 0 && <p>No banners found.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="border p-3 rounded shadow">
            <div className="flex gap-2 mb-2 overflow-x-auto">
              {banner.image.map((media, idx) =>
                media.type === "video" ? (
                  <video
                    key={idx}
                    src={media.url}
                    className="w-20 h-20 object-cover rounded"
                    controls
                  />
                ) : (
                  <img
                    key={idx}
                    src={media.url}
                    alt={`banner-${idx}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                )
              )}
            </div>
            <div className="flex justify-between">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => handleEdit(banner)}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(banner._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
