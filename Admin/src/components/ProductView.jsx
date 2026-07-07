import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://192.168.31.244:3000/api/product/get/${id}`);
        setProduct(res.data.product || res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-2xl rounded-2xl border border-gray-200">
      {/* Product Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-2">{product.name}</h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Gallery (Product Main Images) */}
        <div className="flex-1">
          <div className="flex overflow-x-auto gap-4 scrollbar-hide">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`Product ${idx}`}
                className="w-40 h-40 object-cover rounded-lg border border-gray-300"
              />
            ))}
          </div>
        </div>

        {/* General Product Details */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-4 text-gray-700">
          <div>
            <p><span className="font-semibold">Description:</span> {product.description}</p>
            <p><span className="font-semibold">Brand:</span> {product.brand}</p>
            <p><span className="font-semibold">Category Name:</span> {product.catName}</p>
            <p><span className="font-semibold">Sub Category:</span> {product.subCatName}</p>
            <p><span className="font-semibold">Third Sub Category:</span> {product.thirdsubCatName || "N/A"}</p>
            <p><span className="font-semibold">Model Name:</span> {product.modelName || "N/A"}</p>
            <p>
              <span className="font-semibold">Model Link:</span>{" "}
              {product.modelLink ? (
                <a className="text-blue-500 underline" href={product.modelLink} target="_blank" rel="noopener noreferrer">
                  {product.modelLink}
                </a>
              ) : "N/A"}
            </p>
            <p><span className="font-semibold">Rating:</span> {product.rating}</p>
            <p><span className="font-semibold">Featured:</span> {product.isFeatured ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* Variant Options */}
      {product.variantOptions?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Variant Options</h2>
          {product.variantOptions.map((variant, idx) => (
            <div key={idx} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-bold text-gray-700 mb-2">Variant {idx + 1}</h3>
              <p><strong>Color:</strong> {variant.color?.name || "N/A"}</p>
              <div className="flex gap-2 mt-1">
                {variant.color?.images?.map((img, i) => (
                  <img key={i} src={img.url} alt="Color Variant" className="w-20 h-20 object-cover rounded border" />
                ))}
              </div>
              <p><strong>Size:</strong> {variant.size?.name} (X: {variant.size?.scale?.x}, Y: {variant.size?.scale?.y}, Z: {variant.size?.scale?.z})</p>
              <p><strong>Width:</strong> {variant.width}</p>
              <p><strong>Price:</strong> ₹{variant.price}</p>
              <p><strong>Old Price:</strong> ₹{variant.oldPrice}</p>
              <p><strong>Stock:</strong> {variant.stock}</p>
              <p><strong>Hole Count:</strong> {variant.holeCount || "N/A"}</p>
              <p><strong>PCD:</strong> {variant.pcd || "N/A"}</p>
              <p><strong>CB:</strong> {variant.cb || "N/A"}</p>
              <p><strong>ET:</strong> {variant.et || "N/A"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Specifications */}
      {product.specificC?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Specifications</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {product.specificC.map((spec, idx) => (
              <li key={idx}>{spec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta Info */}
      <div className="mt-6 text-sm text-gray-400 border-t pt-4">
        <p><strong>ID:</strong> {product._id}</p>
        <p><strong>Created:</strong> {new Date(product.createdAt).toLocaleString()}</p>
        <p><strong>Updated:</strong> {new Date(product.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductView;
