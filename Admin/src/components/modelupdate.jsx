import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDataFromApi, postData, putData } from "../utils/api";

const API = "/api/carModel";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function ModelUpdate() {
  const navigate = useNavigate();
  const { carModelId } = useParams();
  const [formData, setFormData] = useState({
    carName:"",brand:"",pcd:"",cb:"",et:"",color:"",
    modelCarYear:"",carModelLink:"",modelName:"",
    modelPublicId:"",imageUrl:"",imagePublicId:""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!carModelId) return;
    setLoading(true);
    fetchDataFromApi(`${API}/${carModelId}`, auth)
      .then(res => setFormData(res))
      .catch(() => setMessage("Failed to fetch"))
      .finally(() => setLoading(false));
  }, [carModelId]);

  const handleFileUpload = async (file, type) => {
    const isImage = type === "image";
    const maxSize = isImage ? 5e6 : 50e6;
    if (!file) return;
    if (file.size > maxSize) return setMessage(`${isImage?"Image":"Model"} too large`);
    if (isImage ? !file.type.startsWith("image/") : false) return setMessage("Invalid file type");

    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("resource_type", isImage ? "image" : "raw");

    try {
      const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${isImage?"image":"raw"}/upload`;
      const res = await axios.post(endpoint, form);
      setFormData(prev => ({
        ...prev,
        ...(isImage
          ? { imageUrl: res.data.secure_url, imagePublicId: res.data.public_id }
          : { carModelLink: res.data.secure_url, modelName: file.name, modelPublicId: res.data.public_id })
      }));
      setMessage(`${isImage?"Image":"Model"} uploaded`);
    } catch {
      setMessage("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fieldType) => {
    const isImage = fieldType === "image";
    const publicId = isImage ? formData.imagePublicId : formData.modelPublicId;
    const clearData = isImage
      ? { imageUrl:"", imagePublicId:"" }
      : { carModelLink:"", modelName:"", modelPublicId:"" };
    if (!publicId) return;
    if (!window.confirm(`Delete ${isImage?"image":"3D model"}?`)) return;

    setLoading(true);
    try {
      await postData(`${API}/${isImage?"deleteImage":"deleteModel"}`, { public_id: publicId }, auth);
      await putData(`${API}/${carModelId}`, clearData, auth);
      setFormData(prev => ({ ...prev, ...clearData }));
      setMessage(`${isImage?"Image":"Model"} deleted`);
    } catch (e) {
      setMessage(e.response?.status === 401 ? "Unauthorized" : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = carModelId ? `${API}/${carModelId}` : API;
      const method = carModelId ? axios.put : axios.post;
      await method(url, formData, auth);
      setMessage(carModelId ? "Updated successfully" : "Created successfully");
      setTimeout(() => navigate("/admin/car-models"), 1000);
    } catch (e) {
      setMessage(e.response?.status === 401 ? "Unauthorized" : e.response?.data.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {carModelId ? "Update Car Model" : "Upload Car Model"}
      </h1>
      {message && <p className="mb-4 text-center">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
       {formData && ["carName","brand","pcd","cb","et","color","modelCarYear"].map(field => (
  <div key={field}>
    <label className="block mb-1 capitalize">{field}</label>
    <input
      name={field}
      value={formData[field] || ""} // fallback to "" to prevent uncontrolled input
      onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
      required={["carName","brand","modelCarYear"].includes(field)}
      className="w-full border px-3 py-2 rounded"
      disabled={loading}
    />
  </div>
))}


        <div>
          <label className="block font-semibold mb-1">Upload Image</label>
          <input type="file" accept="image/*" onChange={e => handleFileUpload(e.target.files[0], "image")} disabled={loading} />
          {formData.imageUrl && (
            <div className="mt-2 relative w-40">
              <img src={formData.imageUrl} alt="Car" className="w-full rounded" />
              <button type="button" onClick={() => handleDelete("image")} className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2" disabled={loading}>
                ✕
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Upload 3D Model</label>
          <input type="file" accept=".glb,.fbx,.obj,.gltf,.3ds" onChange={e => handleFileUpload(e.target.files[0], "model")} disabled={loading} />
          {formData.carModelLink && (
            <div className="mt-2 bg-gray-100 p-2 rounded flex justify-between">
              <a href={formData.carModelLink} target="_blank" className="text-blue-600">{formData.modelName}</a>
              <button type="button" onClick={() => handleDelete("model")} className="text-red-600 font-semibold" disabled={loading}>✕</button>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50">
          {carModelId ? "Update Model" : "Upload Model"}
        </button>
      </form>
    </div>
  );
}
