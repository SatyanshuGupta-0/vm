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
  deleteProductS,
  getProduct,
  removeImageFromCloudinary,
  updateProduct,
  searchProducts, 
  getRelatedProducts,
  searchProductsByName,
  deleteModelController,
  getPaginatedProducts, 
  deleteVariantFromProduct,
  getAllProduct,
} = require("../controller/product.controller");


// 🔒 Admin-only routes
router.post('/uploadImages',  isAdmin("superadmin","shopkeeper"), upload.array('images'), uploadImages);
router.post('/create',isAdmin("superadmin","shopkeeper"), createProduct);
router.delete('/:id',  isAdmin("superadmin"), deleteProduct);
router.delete('deletes/:id',  isAdmin("shopkeeper"), deleteProductS);
router.post('/deleteImage',  isAdmin("superadmin"), removeImageFromCloudinary);
router.put('/updateProduct/:id',  isAdmin("superadmin"), updateProduct);
router.post('/delete-model',  isAdmin("superadmin"), deleteModelController);
router.delete('/:productId/variant/:variantId',  isAdmin("superadmin"), deleteVariantFromProduct);
router.get("/getProducts", isAdmin("shopkeeper"), getAllProduct);

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
