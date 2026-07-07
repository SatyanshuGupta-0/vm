import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { postData } from "../utils/api";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function CarModelUpload() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    carName: "",
    brand: "",
    pcd: "",
    cb: "",
    et: "",
    color: "",
    modelCarYear: "",
    carModelLink: "",
    modelName: "",
    modelPublicId: "",
    imageUrl: "",
    imagePublicId: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload image to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("resource_type", "image"); // explicitly set resource_type

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Debug log Cloudinary response
      console.log("Image upload response:", res.data);

      setFormData((prev) => ({
        ...prev,
        imageUrl: res.data.secure_url,
        imagePublicId: res.data.public_id,
      }));
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed");
    }
  };

  // Upload 3D model (raw) to Cloudinary
  const handleModelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("resource_type", "raw"); // explicitly set resource_type for raw files

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Debug log Cloudinary response
      console.log("Model upload response:", res.data);

      setFormData((prev) => ({
        ...prev,
        carModelLink: res.data.secure_url,
        modelName: file.name,
        modelPublicId: res.data.public_id,
      }));
    } catch (err) {
      console.error("Model upload failed", err);
      alert("Model upload failed");
    }
  };

  // Submit form data to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postData("/api/carModel", formData);
      alert("Car model uploaded successfully!");
      navigate("/admin/car-models");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Upload failed");
    }
  };

  // Delete uploaded image from Cloudinary (via backend)
  const handleDeleteImage = async () => {
    if (!formData.imagePublicId) return;
    try {
      await axios.post("http://192.168.31.244:3000/api/carModel/deleteImage", {
        public_id: formData.imagePublicId,
      });
      setFormData((prev) => ({ ...prev, imageUrl: "", imagePublicId: "" }));
    } catch (err) {
      console.error("Failed to delete image", err);
      alert("Failed to delete image");
    }
  };

  // Delete uploaded 3D model from Cloudinary (via backend)
  const handleDeleteModel = async () => {
    if (!formData.modelPublicId) return;
    try {
      await axios.post("http://192.168.31.244:3000/api/carModel/deleteModel", {
        public_id: formData.modelPublicId,
        resource_type: "raw",
      });
      setFormData((prev) => ({
        ...prev,
        carModelLink: "",
        modelName: "",
        modelPublicId: "",
      }));
    } catch (err) {
      console.error("Failed to delete model", err);
      alert("Failed to delete model");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Car Model</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["carName", "brand", "pcd", "cb", "et", "color", "modelCarYear"].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required={field === "carName"}
            />
          </div>
        ))}

        {/* Image Upload */}
        <div>
          <label className="block font-semibold mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full"
          />
          {formData.imageUrl && (
            <div className="mt-2 relative w-40">
              <img
                src={formData.imageUrl}
                alt="Car preview"
                className="w-full border rounded"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute top-1 right-1 text-white bg-red-600 rounded-full px-2 text-sm"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Model Upload */}
        <div>
          <label className="block font-semibold mb-1">Upload 3D Model (.glb, .obj, etc.)</label>
          <input
            type="file"
            accept=".glb,.fbx,.obj,.gltf,.3ds"
            onChange={handleModelUpload}
            className="block w-full"
          />
          {formData.carModelLink && (
            <div className="mt-2 flex justify-between items-center border p-2 rounded bg-gray-50">
              <a
                href={formData.carModelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {formData.modelName || "View model"}
              </a>
              <button
                type="button"
                onClick={handleDeleteModel}
                className="text-red-600 font-semibold"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Upload Car Model
        </button>

        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </form>
    </div>
  );
}
