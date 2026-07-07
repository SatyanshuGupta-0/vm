import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchDataFromApi, postData, putData } from "../utils/api";

// Cloudinary config
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();


  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetchDataFromApi(`/api/product/get/${id}`);
        setProduct(res);
      } catch (err) {
        console.error("Error fetching product", err);
        alert("Failed to load product data.");
      }
    };
    fetchProduct();
  }, [id]);

  // const handleImageUpload = async (e) => {
  //   const files = Array.from(e.target.files);
  //   const uploaders = files.map(async (file) => {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("upload_preset", UPLOAD_PRESET);
  //     const res = await axios.post(
  //       `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
  //       formData
  //     );
  //     return {
  //       url: res.data.secure_url,
  //       public_id: res.data.public_id,
  //     };
  //   });

  //   try {
  //     const urls = await Promise.all(uploaders);
  //     setProduct((prev) => ({
  //       ...prev,
  //       images: [...(prev.images || []), ...urls],
  //     }));
  //   } catch (err) {
  //     console.error("Upload failed", err);
  //     alert("Image upload failed");
  //   }
  // };

  // const handleDeleteImage = async (public_id, index) => {
  //   try {
  //     await axios.post("http://192.168.31.244:3000/api/product/deleteImage", { public_id });
  //     setProduct((prev) => ({
  //       ...prev,
  //       images: prev.images.filter((_, i) => i !== index),
  //     }));
  //     alert("Image deleted successfully");
  //   } catch (err) {
  //     console.error("Failed to delete image", err);
  //     alert("Failed to delete image");
  //   }
  // };

  // const handleImageDrop = (e) => {
  //   e.preventDefault();
  //   const files = Array.from(e.dataTransfer.files);
  //   handleImageUpload({ target: { files } });
  // };

  // Variant color image upload
  // New state to track pending image uploads
  // Fix initial state
  const [newVariantImages, setNewVariantImages] = useState({});
  const [removedVariantImageIds, setRemovedVariantImageIds] = useState({});

  // Handle upload
  const handleVariantImageUpload = (e, variantIndex) => {
    const files = Array.from(e.target.files);

    setNewVariantImages((prev) => ({
      ...prev,
      [variantIndex]: [...(prev[variantIndex] || []), ...files],
    }));
  };

  // Handle delete
  const handleDeleteVariantImage = (variantIndex, imgIndex, isCloudImage = true) => {
    const updatedVariants = [...product.variantOptions];

    if (isCloudImage === "cloud") {
      const image = updatedVariants[variantIndex]?.color?.images?.[imgIndex];

      if (image && image.public_id) {
        setRemovedVariantImageIds((prev) => {
          const currentArray = Array.isArray(prev[variantIndex]) ? prev[variantIndex] : [];
          return {
            ...prev,
            [variantIndex]: [...currentArray, image.public_id],
          };
        });

        updatedVariants[variantIndex].color.images.splice(imgIndex, 1);
        setProduct((prev) => ({
          ...prev,
          variantOptions: updatedVariants,
        }));
      }
    } else if (isCloudImage === "local") {
      setNewVariantImages((prev) => {
        const updated = { ...prev }; // now prev is an object
        if (!Array.isArray(updated[variantIndex])) return prev;

        updated[variantIndex] = updated[variantIndex].filter((_, i) => i !== imgIndex);
        return updated;
      });
    }
  };








  // Delete variant and all variant images from Cloudinary
  const handleRemoveVariant = async (index) => {
    const variant = product.variantOptions[index];
    const imagesToDelete = variant.color.images || [];

    // Delete all images from Cloudinary
    for (const image of imagesToDelete) {
      if (image.public_id) {
        try {
          await postData("/api/product/deleteImage", {
            public_id: image.public_id,
          });
        } catch (err) {
          console.error("Failed to delete image:", err);
        }
      }
    }

    // Remove variant from state
    const updated = product.variantOptions.filter((_, i) => i !== index);
    setProduct({ ...product, variantOptions: updated });
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...(product[field] || [])];
    updatedArray[index] = value;
    setProduct((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const addArrayItem = (field) => {
    setProduct((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = (product[field] || []).filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleModelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
        formData
      );

      setProduct((prev) => ({
        ...prev,
        modelLink: res.data.secure_url,
        modelPublicId: res.data.public_id,
        modelName: file.name,
      }));
    } catch (err) {
      console.error("Model upload failed:", err);
      alert("Model upload failed");
    }
  };

  const handleDeleteModel = async () => {
    try {
      await postData("/api/product/delete-model", {
        public_id: product.modelPublicId,
        resource_type: "raw",
      });

      setProduct((prev) => ({
        ...prev,
        modelLink: "",
        modelPublicId: "",
        modelName: "",
      }));
      alert("Model deleted successfully");
    } catch (err) {
      console.error("Failed to delete model", err);
      alert("Failed to delete model");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedVariants = [...product.variantOptions];

      for (let i = 0; i < updatedVariants.length; i++) {
        // 1. Delete removed Cloudinary images
        const deleteList = removedVariantImageIds[i] || [];
        for (const public_id of deleteList) {
          await postData("/api/product/deleteImage", { public_id }, true);
        }

        // 2. Upload new variant images
        const filesToUpload = newVariantImages[i] || [];
        const uploadedImages = [];

        for (const file of filesToUpload) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", UPLOAD_PRESET);

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData
          );

          uploadedImages.push({
            url: res.data.secure_url,
            public_id: res.data.public_id,
          });
        }

        // 3. Merge newly uploaded with existing images
        updatedVariants[i].color.images = [
          ...(updatedVariants[i].color.images || []),
          ...uploadedImages,
        ];
      }

      // Final product object with updated variant images
      const updatedProduct = {
        ...product,
        variantOptions: updatedVariants,
      };

      await putData(`/api/product/updateProduct/${id}`, updatedProduct);
      alert("Product updated successfully!");
      navigate("/product");
    } catch (err) {
      console.error("Submit failed", err);
      alert("Update failed");
    }
  };


  if (!product) {
    return <div className="text-center mt-10">Loading product...</div>;
  }

  const variantFields = [
    { label: "Price", key: "price", type: "number" },
    { label: "Old Price", key: "oldPrice", type: "number" },
    { label: "Stock", key: "stock", type: "number" },
    { label: "Width", key: "width", type: "text" },
    { label: "Hole Count", key: "holeCount", type: "number" },
    { label: "PCD", key: "pcd", type: "text" },
    { label: "CB", key: "cb", type: "text" },
    { label: "ET", key: "et", type: "text" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Image Upload */}
        <div className="flex flex-wrap gap-6">
          {/* <div
            onDrop={handleImageDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current.click()}
            className="border-2 border-dashed p-4 w-80 h-60 flex items-center justify-center bg-white text-center rounded cursor-pointer text-gray-600"
          >
            <div>
              <h1 className="text-3xl">+</h1>
              <p>Click or drag to upload images</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div> */}

          <div className="flex-1 min-w-[300px]">
            <label className="block mb-3">Name *
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="block w-full border rounded px-3 py-2 mt-1"
              />
            </label>
            <label className="block">Description *
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                required
                rows={5}
                className="block w-full border rounded px-3 py-2 mt-1"
              />
            </label>
          </div>
        </div>

        {/* Image Previews */}
        <div className="flex gap-4 overflow-x-auto mt-4">
          {(product.images || []).map((imgObj, idx) => (
            <div key={idx} className="relative w-32 h-32 flex-shrink-0">
              <img
                src={imgObj.url}
                alt={`Image ${idx + 1}`}
                className="w-full h-full object-cover border rounded"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(imgObj.public_id, idx)}
                className="absolute top-1 right-1 text-white bg-black bg-opacity-75 rounded-full px-2 hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* 3D Model Upload */}
        {/* <div className="mt-6">
          <label className="block font-medium mb-2">Upload 3D Model (GLB/FBX)</label>
          <input
            type="file"
            accept=".glb,.fbx,.obj,.gltf"
            onChange={handleModelUpload}
            className="border p-2 rounded w-full"
          />
        </div> */}

        {product.modelLink && (
          <div className="mt-4 p-4 bg-gray-100 border rounded flex justify-between items-center">
            <div className="text-sm text-gray-700 break-all">
              <p className="font-semibold">3D Model:</p>
              <a href={product.modelLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {product.modelName || "View model"}
              </a>
            </div>
            <button
              type="button"
              onClick={handleDeleteModel}
              className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700"
            >
              Delete Model
            </button>
          </div>
        )}

        {/* Product Fields */}
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
  {[
    "brand", "catName", "subCatName", "thirdsubCatName", "category", "modelName", "modelLink"
  ].map((field) => {
    // Define placeholder text for specific fields
    const placeholders = {
      catName: "e.g., Electronics",
      subCatName: "e.g., Mobile Phones",
      thirdsubCatName: "e.g., 6GB RAM",
      brand: "e.g., JBL",
      modelName: "Not required",
      modelLink: "Not required",
      category: "Not required",
    };

    return (
      <label key={field} className="block">
        {field}
        <input
          type={["price", "oldPrice", "countInStock", "discount"].includes(field) ? "number" : "text"}
          name={field}
          value={product[field] || ""}
          onChange={handleChange}
          placeholder={placeholders[field] || ""}
          className="block w-full border rounded px-2 py-1 mt-1"
        />
      </label>
    );
  })}
</div>


        <div className="mt-8 border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Variant Options</h2>

          {product.variantOptions.map((variant, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded p-4 mb-6"
            >
              <h3 className="text-lg font-semibold mb-2">
                Variant {index + 1}
              </h3>

              {/* Color Name */}
              <div className="mb-4">
                <label className="block font-semibold mb-1">Color Name</label>
                <input
                  type="text"
                  value={variant.color?.name || ''}
                  onChange={(e) => {
                    const updated = [...product.variantOptions];
                    updated[index].color.name = e.target.value;
                    setProduct({ ...product, variantOptions: updated });
                  }}
                  className="border w-full px-2 py-1 rounded"
                />
              </div>

              {/* Image Upload & Previews */}
              <div className="mb-4">
                <label className="block font-semibold mb-1">Upload Color Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleVariantImageUpload(e, index)}
                  className="border rounded w-full px-2 py-1"
                />

                <div className="flex flex-wrap gap-2 mt-2">
                  {/* Uploaded Cloudinary Images */}
                  {(variant.color.images || []).map((img, imgIndex) => (
                    <div key={`cloud-${img.public_id || imgIndex}`} className="relative w-16 h-16">
                      <img
                        src={img.url}
                        alt="Uploaded"
                        className="w-full h-full object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteVariantImage(index, imgIndex, "cloud")}
                        className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* New Local Images */}
                  {(newVariantImages[index] || []).map((imgFile, imgIndex) => (
                    <div key={`local-${imgIndex}`} className="relative w-16 h-16">
                      <img
                        src={URL.createObjectURL(imgFile)}
                        alt="New"
                        className="w-full h-full object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteVariantImage(index, imgIndex, "local")}
                        className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes Table */}
              <div className="overflow-x-auto">
                <h4 className="font-semibold mb-2">Size Options</h4>

                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-10 border ">Size Name</th>
                      {/* <th className="px-10 border ">X</th>
                      <th className="px-10 border ">Y</th>
                      <th className="px-10 border ">Z</th> */}
                      <th className="px-10 border ">Price (₹)</th>
                      <th className="px-10 border ">Old Price (₹)</th>
                      <th className="px-10 border ">Stock</th>
                      <th className="px-10 border ">Width</th>
                      <th className="px-10 border ">Hole Count</th>
                      <th className="px-10 border ">PCD</th>
                      <th className="px-10 border ">CB</th>
                      <th className="px-10 border ">ET</th>
                      <th className="px-10 border ">Specific Cars</th>
                      <th className="px-10 border ">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variant.sizes?.map((size, sIndex) => (
                      <tr key={sIndex} className="border">
                        <td className="p-2 border">
                          <input
                            type="text"
                            value={size.name}
                            onChange={(e) => {
                              const updated = [...product.variantOptions];
                              updated[index].sizes[sIndex].name = e.target.value;
                              setProduct({ ...product, variantOptions: updated });
                            }}
                            className="border px-1 py-1 w-full"
                          />
                        </td>
                        {/* {["x", "y", "z"].map((axis) => (
                          <td className="p-2 border" key={axis}>
                            <input
                              type="number"
                              value={size.scale?.[axis] || ""}
                              onChange={(e) => {
                                const updated = [...product.variantOptions];
                                updated[index].sizes[sIndex].scale = {
                                  ...updated[index].sizes[sIndex].scale,
                                  [axis]: parseFloat(e.target.value),
                                };
                                setProduct({ ...product, variantOptions: updated });
                              }}
                              className="border px-1 py-1 w-full"
                            />
                          </td>
                        ))} */}

                        {["price", "oldPrice", "stock", "width", "holeCount", "pcd", "cb", "et"].map((key) => (
                          <td className="p-2 border" key={key}>
                            <input
                              type="text"
                              value={size[key] || ""}
                              onChange={(e) => {
                                const updated = [...product.variantOptions];
                                updated[index].sizes[sIndex][key] =
                                  key === "price" || key === "oldPrice" || key === "stock"
                                    ? parseFloat(e.target.value) || 0
                                    : e.target.value;
                                setProduct({ ...product, variantOptions: updated });
                              }}
                              className="border px-1 py-1 w-full"
                            />
                          </td>
                        ))}

                        <td className="p-2 border">
                          <div className="flex flex-col gap-1">
                            {(size.specificC || []).map((item, i) => (
                              <div key={i} className="flex gap-1 items-center">
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => {
                                    const updated = [...product.variantOptions];
                                    updated[index].sizes[sIndex].specificC[i] = e.target.value;
                                    setProduct({ ...product, variantOptions: updated });
                                  }}
                                  className="border px-1 py-1 flex-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...product.variantOptions];
                                    updated[index].sizes[sIndex].specificC.splice(i, 1);
                                    setProduct({ ...product, variantOptions: updated });
                                  }}
                                  className="text-red-600 font-bold"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...product.variantOptions];
                                if (!updated[index].sizes[sIndex].specificC)
                                  updated[index].sizes[sIndex].specificC = [];
                                updated[index].sizes[sIndex].specificC.push("");
                                setProduct({ ...product, variantOptions: updated });
                              }}
                              className="text-sm bg-blue-600 text-white px-2 py-1 rounded mt-1"
                            >
                              + Add
                            </button>
                          </div>
                        </td>

                        <td className="p-2 border text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...product.variantOptions];
                              updated[index].sizes.splice(sIndex, 1);
                              setProduct({ ...product, variantOptions: updated });
                            }}
                            className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Add Size Button */}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...product.variantOptions];
                    if (!updated[index].sizes) updated[index].sizes = [];
                    updated[index].sizes.push({
                      name: "",
                      scale: { x: 1, y: 1, z: 1 },
                      price: 0,
                      oldPrice: 0,
                      stock: 0,
                      width: "",
                      holeCount: "",
                      pcd: "",
                      cb: "",
                      et: "",
                      specificC: [],
                    });
                    setProduct({ ...product, variantOptions: updated });
                  }}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                >
                  + Add More Size
                </button>
              </div>

              {/* Remove Variant Button */}
              <button
                type="button"
                onClick={() => handleRemoveVariant(index)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full font-bold"
              >
                ✕ Remove Variant
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setProduct({
                ...product,
                variantOptions: [
                  ...(product.variantOptions || []),
                  {
                    color: { name: '', hex: '', images: [] },
                    size: { name: '', scale: { x: 1, y: 1, z: 1 } },
                    price: 0,
                    stock: 0,
                  },
                ],
              })
            }
            className="bg-green-600 text-green-50 p-2 rounded-md font-semibold"
          >
            + Add Colour Variant
          </button>
        </div>


        {/* Checkbox */}
        <label className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            name="isFeatured"
            checked={product.isFeatured}
            onChange={handleChange}
          />
          Is Featured
        </label>



        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded mt-6 hover:bg-blue-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
