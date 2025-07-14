const express = require('express');
const multer = require('multer');
const auth = require('../middlewares/auth');
const {
  getAllReviews,
  getReviewsByProduct,
  createReview,
  getReviewById,
  deleteReview,
  updateReview,
} = require('../controller/Review.Controller');

const router = express.Router();

router.get('/', getAllReviews);
router.get('/product/:productId', getReviewsByProduct);
router.post('/', auth, createReview);
router.get('/:id', getReviewById);
router.delete('/:id',auth, deleteReview);
router.put('/:id',auth, updateReview);

module.exports = router;
