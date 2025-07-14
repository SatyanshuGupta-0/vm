const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../middlewares/multer");

const {
  uploadImages,
  createProduct,
  getAllProducts,
  getAllProductsByCatId,
  getAllProductsByCatName,
  getAllProductsBySubCatId,
  getAllProductsBySubCatName,
  getAllProductsByThirdLevelCatId,
  getAllProductsByThirdLevelCatName,
  getAllProductsByPrice,
  getAllProductsByRating,
  getProductsCount,
  getAllFeaturedProducts,
  deleteProduct,
  getProduct,
  removeImageFromCloudinary,
  updateProduct,
  searchProducts, 
  getRelatedProducts,
  searchProductsByName,
  deleteModelController,
  getPaginatedProducts, 
  deleteVariantFromProduct,
} = require("../controller/product.controller");


// 🔒 Admin-only routes
router.post('/uploadImages',  isAdmin, upload.array('images'), uploadImages);
router.post('/create', createProduct);
router.delete('/:id',  isAdmin, deleteProduct);
router.post('/deleteImage',  isAdmin, removeImageFromCloudinary);
router.put('/updateProduct/:id',  isAdmin, updateProduct);
router.post('/delete-model',  isAdmin, deleteModelController);
router.delete('/:productId/variant/:variantId',  isAdmin, deleteVariantFromProduct);

// 🧑‍💼 Authenticated or public routes
router.get('/search', searchProducts); // public
router.get('/getAllProducts', getAllProducts);
router.get('/getAllProductsByCatId/:id', getAllProductsByCatId);
router.get('/getAllProductsByCatName', getAllProductsByCatName);
router.get('/getAllProductsBySubCatId/:id', getAllProductsBySubCatId);
router.get('/getAllProductsBySubCatName', getAllProductsBySubCatName);
router.get('/getAllProductsByThirdLevelCatId/:id', getAllProductsByThirdLevelCatId);
router.get('/getAllProductsByThirdLevelCatName', getAllProductsByThirdLevelCatName);
router.get('/getAllProductsByPrice', getAllProductsByPrice);
router.get('/getAllProductsByRating', getAllProductsByRating);
router.get('/getProductsCount', getProductsCount);
router.get('/getAllFeaturedProducts', getAllFeaturedProducts);
router.get('/related/:productId', getRelatedProducts);
router.get('/getPaginatedProducts', getPaginatedProducts);
router.get('/get/:id', getProduct); // single product

module.exports = router;
