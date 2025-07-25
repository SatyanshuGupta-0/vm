const Product = require('../model/VMProduct.model');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');

// Upload images to Cloudinary
exports.uploadImages = async (req, res) => {
  try {
    const urls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
      urls.push({ url: result.secure_url, public_id: result.public_id });

      // Delete local file after upload
      fs.unlinkSync(file.path);
    }
    res.status(200).json({ images: urls });
  } catch (err) {
    res.status(500).json({ error: "Image upload failed", details: err.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      createdBy: req.admin.id, // ✅ Add admin ID from auth
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(400).json({ error: err.message });
  }
};



// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const adminId = req.admin.id; // Automatically set by auth middleware

    const products = await Product.find({ createdBy: adminId }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// controllers/productController.js\

exports.searchProducts = async (req, res) => {
  try {
    const {
      query,
      name,
      brand,
      catName,
      subCatName,
      thirdsubCatName,
      minPrice,
      maxPrice,
      rating,
      isFeatured,
      countInStock,
      modelName,
      modelLink,
      size,
      width,
      colorName,
      minColorPrice,
      maxColorPrice,
      holeCount,
      pcd,
      cb,
      et,
      specificC,
    } = req.query;

    const filter = {};

    // 🔍 Keyword search across multiple fields
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { catName: { $regex: query, $options: "i" } },
        { subCatName: { $regex: query, $options: "i" } },
        { thirdsubCatName: { $regex: query, $options: "i" } },
        { modelName: { $regex: query, $options: "i" } },
        { modelLink: { $regex: query, $options: "i" } },
        { colorName: { $regex: query, $options: "i" } },
        { size: { $regex: query, $options: "i" } },
        { width: { $regex: query, $options: "i" } },
        { pcd: { $regex: query, $options: "i" } },
        { cb: { $regex: query, $options: "i" } },
        { et: { $regex: query, $options: "i" } },
        { specificC: { $regex: query, $options: "i" } },
      ];
    }

    // Additional filters
    if (brand) filter.brand = Array.isArray(brand) ? { $in: brand } : { $in: [brand] };
    if (catName) filter.catName = { $regex: catName, $options: "i" };
    if (subCatName) filter.subCatName = { $regex: subCatName, $options: "i" };
    if (thirdsubCatName) filter.thirdsubCatName = { $regex: thirdsubCatName, $options: "i" };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (rating) filter.rating = { $gte: parseFloat(rating) };
    if (isFeatured === "true") filter.isFeatured = true;
    if (countInStock === "1") filter.countInStock = { $gt: 0 };

    if (modelName) filter.modelName = { $regex: modelName, $options: "i" };
    if (modelLink) filter.modelLink = { $regex: modelLink, $options: "i" };
    if (size) filter.size = size;
    if (width) filter.width = width;
    if (colorName) filter.colorName = { $regex: colorName, $options: "i" };

    if (minColorPrice || maxColorPrice) {
      filter.colorPrice = {};
      if (minColorPrice) filter.colorPrice.$gte = parseFloat(minColorPrice);
      if (maxColorPrice) filter.colorPrice.$lte = parseFloat(maxColorPrice);
    }

    if (holeCount) filter.holeCount = parseInt(holeCount);
    if (pcd) filter.pcd = pcd;
    if (cb) filter.cb = cb;
    if (et) filter.et = et;

    if (specificC) {
      const arr = Array.isArray(specificC)
        ? specificC
        : specificC.split(",").map((s) => s.trim());
      filter.specificC = { $all: arr };
    }

    const products = await Product.find(filter).limit(50);
    res.status(200).json(products);
  } catch (err) {
    console.error("Error in searchProducts:", err);
    res.status(500).json({ error: err.message });
  }
};





// Get by Category ID
exports.getAllProductsByCatId = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.id });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by Category Name
exports.getAllProductsByCatName = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.find({ categoryName: { $regex: name, $options: 'i' } });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by Sub-category ID
exports.getAllProductsBySubCatId = async (req, res) => {
  try {
    const products = await Product.find({ subCategory: req.params.id });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by Sub-category Name
exports.getAllProductsBySubCatName = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.find({ subCategoryName: { $regex: name, $options: 'i' } });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by Third-level Category ID
exports.getAllProductsByThirdLevelCatId = async (req, res) => {
  try {
    const products = await Product.find({ thirdLevelCategory: req.params.id });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by Third-level Category Name
exports.getAllProductsByThirdLevelCatName = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.find({ thirdLevelCategoryName: { $regex: name, $options: 'i' } });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filter by Price Range
exports.getAllProductsByPrice = async (req, res) => {
  try {
    const { min, max } = req.query;
    const products = await Product.find({
      price: { $gte: parseFloat(min), $lte: parseFloat(max) }
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filter by Rating
exports.getAllProductsByRating = async (req, res) => {
  try {
    const { rating } = req.query;
    const products = await Product.find({ rating: { $gte: parseFloat(rating) } });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product count
exports.getProductsCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get featured products
exports.getAllFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(10);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete product
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     if (Array.isArray(product.images) && product.images.length > 0) {
//       const deletePromises = product.images.map(async (img) => {
//         if (img && typeof img === "object" && img.public_id) {
//           try {
//             await cloudinary.uploader.destroy(img.public_id);
//             console.log(`Deleted image ${img.public_id} from Cloudinary`);
//           } catch (err) {
//             console.error(`Failed to delete image ${img.public_id}:`, err.message);
//           }
//         } else {
//           console.log("Skipping image without public_id:", img);
//         }
//       });

//       await Promise.all(deletePromises);
//     } else {
//       console.log("No images to delete for this product");
//     }

//     // Delete product document from DB
//     await product.deleteOne();

//     res.status(200).json({ message: "Product and images deleted successfully" });
//   } catch (err) {
//     console.error("Delete product error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const deleteImage = async (img) => {
      if (img && typeof img === "object" && img.public_id) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
          console.log(`Deleted image ${img.public_id} from Cloudinary`);
        } catch (err) {
          console.error(`Failed to delete image ${img.public_id}:`, err.message);
        }
      }
    };

    // Delete top-level product images
    if (Array.isArray(product.images)) {
      await Promise.all(product.images.map(deleteImage));
    }

    // Delete variant color images
    if (Array.isArray(product.variantOptions)) {
      for (const variant of product.variantOptions) {
        const colorImages = variant?.color?.images || [];
        if (Array.isArray(colorImages)) {
          await Promise.all(colorImages.map(deleteImage));
        }
      }
    }

    // Delete product document from DB
    await product.deleteOne();

    res.status(200).json({ message: "Product and all images deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove image from Cloudinary
exports.removeImageFromCloudinary = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) return res.status(400).json({ error: "public_id is required" });

    await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ message: "Image removed from Cloudinary" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/productController.js
// exports.getRelatedProducts = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.productId);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Find related products by category, excluding the current product
//     const rawRelated = await Product.find({
//       _id: { $ne: product._id },
//       category: product.category,
//     }).limit(8); // Limit number of related base products

//     const expanded = [];

//     rawRelated.forEach(prod => {
//       if (Array.isArray(prod.variantOptions) && prod.variantOptions.length > 0) {
//         prod.variantOptions.forEach(variant => {
//           expanded.push({
//             _id: `${prod._id}-${variant._id}`, // Unique ID per variant
//             name: prod.name,
//             brand: prod.brand,
//             category: prod.category,
//             images: variant.color?.images?.length > 0 ? variant.color.images : prod.images,
//             variantColor: variant.color?.name || "",
//             variantSize: variant.size?.name || "",
//             price: variant.price,
//             oldPrice: variant.oldPrice,
//             stock: variant.stock,
//             rating: prod.rating || 0,
//             createdAt: prod.createdAt,
//             updatedAt: prod.updatedAt,
//           });
//         });
//       } else {
//         // No variants — push original product
//         expanded.push({
//           _id: prod._id,
//           name: prod.name,
//           brand: prod.brand,
//           category: prod.category,
//           images: prod.images,
//           price: prod.price,
//           stock: prod.stock,
//           rating: prod.rating || 0,
//           createdAt: prod.createdAt,
//           updatedAt: prod.updatedAt,
//         });
//       }
//     });

//     // Optional: Shuffle the results so they appear randomly
//     for (let i = expanded.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [expanded[i], expanded[j]] = [expanded[j], expanded[i]];
//     }

//     res.status(200).json({ related: expanded });
//   } catch (err) {
//     console.error("Error getting related products:", err);
//     res.status(500).json({
//       message: "Error getting related products",
//       error: err.message,
//     });
//   }
// };


exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch related products from same category, excluding the current one
    const rawRelated = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    }).limit(12); // Adjust limit as needed

    const relatedVariants = [];

    rawRelated.forEach((prod) => {
      if (Array.isArray(prod.variantOptions) && prod.variantOptions.length > 0) {
        prod.variantOptions.forEach((variant) => {
          if (Array.isArray(variant.sizes) && variant.sizes.length > 0) {
            variant.sizes.forEach((size) => {
              relatedVariants.push({
                _id: `${prod._id}-${variant._id}-${size._id}`,
                name: prod.name,
                brand: prod.brand,
                category: prod.category,
                images: variant.color?.images?.length > 0 ? variant.color.images : prod.images,
                variantColor: variant.color?.name || "",
                variantSize: size.name || "",
                price: size.price || 0,
                oldPrice: size.oldPrice || 0,
                stock: size.stock || 0,
                rating: prod.rating || 0,
                createdAt: prod.createdAt,
                updatedAt: prod.updatedAt,
              });
            });
          } else {
            // Variant has no sizes – fallback to variant-level
            relatedVariants.push({
              _id: `${prod._id}-${variant._id}`,
              name: prod.name,
              brand: prod.brand,
              category: prod.category,
              images: variant.color?.images?.length > 0 ? variant.color.images : prod.images,
              variantColor: variant.color?.name || "",
              variantSize: "",
              price: variant.price || 0,
              oldPrice: variant.oldPrice || 0,
              stock: variant.stock || 0,
              rating: prod.rating || 0,
              createdAt: prod.createdAt,
              updatedAt: prod.updatedAt,
            });
          }
        });
      } else {
        // No variantOptions at all — fallback to base product
        relatedVariants.push({
          _id: prod._id.toString(),
          name: prod.name,
          brand: prod.brand,
          category: prod.category,
          images: prod.images,
          price: prod.price || 0,
          stock: prod.stock || 0,
          rating: prod.rating || 0,
          createdAt: prod.createdAt,
          updatedAt: prod.updatedAt,
        });
      }
    });

    // Shuffle results (optional)
    for (let i = relatedVariants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [relatedVariants[i], relatedVariants[j]] = [relatedVariants[j], relatedVariants[i]];
    }

    res.status(200).json({ related: relatedVariants });
  } catch (err) {
    console.error("Error getting related products:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



exports.deleteModelController = async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ success: false, message: "public_id is required" });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "raw", // important for 3D models
    });

    if (result.result === "ok") {
      return res.status(200).json({ success: true, message: "Model deleted from Cloudinary" });
    } else {
      return res.status(404).json({ success: false, message: "Model not found on Cloudinary" });
    }
  } catch (error) {
    console.error("Cloudinary delete model error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete model" });
  }
};

// GET /api/product/getPaginatedProducts?page=1&limit=20
exports.getPaginatedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;        // Default to page 1
    const limit = parseInt(req.query.limit) || 20;     // Default limit per page

    const skip = (page - 1) * limit;

    const total = await Product.countDocuments();      // Total products in DB

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/product/:productId/variant/:variantId

exports.deleteVariantFromProduct = async (req, res) => {
  try {
  const { productId, variantId } = req.params;
  console.log("Deleting variant:", variantId, "from product:", productId);

  const product = await Product.findById(productId);
  if (!product) {
    console.log("Product not found");
    return res.status(404).json({ message: "Product not found" });
  }
  console.log("Product found:", product.name);

  if (!Array.isArray(product.variantOptions)) {
    console.log("variantOptions missing or not array");
    return res.status(400).json({ message: "No variants available" });
  }

  const variant = product.variantOptions.find(v => v._id.toString() === variantId);
  if (!variant) {
    console.log("Variant not found");
    return res.status(404).json({ message: "Variant not found" });
  }
  console.log("Variant found:", variant._id);

  // Delete images from Cloudinary
  const imageDeletionPromises = (variant.color?.images || []).map(async (img) => {
    if (img.public_id) {
      try {
        console.log("Deleting image:", img.public_id);
        await cloudinary.uploader.destroy(img.public_id);
        console.log(`Deleted Cloudinary image: ${img.public_id}`);
      } catch (err) {
        console.warn(`Error deleting image ${img.public_id}:`, err.message);
      }
    }
  });

  await Promise.all(imageDeletionPromises);

  product.variantOptions = product.variantOptions.filter(v => v._id.toString() !== variantId);
  await product.save();

  console.log("Variant deleted and product saved");

  res.status(200).json({
    message: "Variant and its images deleted successfully",
    updatedProduct: product,
  });
} catch (err) {
  console.error("Failed to delete variant with images:", err.stack || err);
  res.status(500).json({ error: "Server error while deleting variant" });
}

};



