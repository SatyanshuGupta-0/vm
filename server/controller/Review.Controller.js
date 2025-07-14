const mongoose = require('mongoose');
const Review = require('../model/VMReview.model');  // Make sure this path is correct!
const cloudinary = require('../config/cloudinaryConfig'); // adjust path as needed

// Create a new review

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, reviewText, media } = req.body; // expect media array
    const userId = req.user?.id; // authentication middleware should add this

    // Basic validations
    if (!productId || !rating || !reviewText || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Validate media array if present
    let mediaArr = [];
    if (Array.isArray(media)) {
      for (const item of media) {
        if (!item.url || !item.type || !['image', 'video'].includes(item.type)) {
          return res.status(400).json({ error: 'Invalid media item' });
        }
      }
      mediaArr = media;
    }

    // Create review with media array
    const review = new Review({
      productId,
      userId,
      rating,
      reviewText,
      media: mediaArr,
    });

    await review.save();

    res.status(201).json(review);
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Server error while creating review' });
  }
};


// Get all reviews (optionally for admin or debugging)
exports.getAllReviews = async (_, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name');
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Get all reviews error:', err);
    res.status(500).json({ error: 'Server error while fetching reviews' });
  }
};

// Get all reviews for a specific product
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ error: 'Missing product ID' });
    }

    const reviews = await Review.find({ productId })
  .sort({ createdAt: -1 })
  .populate('userId', 'name email avatar') // This will now work if ref is 'user'
  .lean();


    res.status(200).json({ data: reviews });
  } catch (err) {
    console.error('Error fetching reviews by product:', err);
    res.status(500).json({ error: 'Server error while fetching product reviews' });
  }
};



// Get single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const review = await Review.findById(id).populate('userId', 'name');
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (err) {
    console.error('Error fetching review by ID:', err);
    res.status(500).json({ error: 'Server error while fetching review' });
  }
};

// Delete review by ID
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Delete media from Cloudinary
    for (const mediaItem of review.media) {
      if (mediaItem.publicId) {
        try {
          await cloudinary.uploader.destroy(mediaItem.publicId, {
            resource_type: mediaItem.type === 'video' ? 'video' : 'image',
          });
        } catch (err) {
          console.error(`Failed to delete media with publicId ${mediaItem.publicId}`, err);
        }
      }
    }

    await review.deleteOne(); // Actually delete the review after media cleanup

    res.status(200).json({ message: 'Review and associated media deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: 'Server error while deleting review' });
  }
};


// Update review by ID
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, reviewText, media } = req.body;
    const userId = req.user?.id; // Assume middleware sets this

    // Validate review ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    // Validate ownership (optional: only allow author to update)
    const existingReview = await Review.findById(id);
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (existingReview.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized to update this review' });
    }

    // Validate media (if provided)
    let mediaArr = existingReview.media; // default to existing
    if (Array.isArray(media)) {
      for (const item of media) {
        if (!item.url || !item.type || !['image', 'video'].includes(item.type)) {
          return res.status(400).json({ error: 'Invalid media item' });
        }
      }
      mediaArr = media;
    }

    // Update fields
    existingReview.rating = rating ?? existingReview.rating;
    existingReview.reviewText = reviewText ?? existingReview.reviewText;
    existingReview.media = mediaArr;

    await existingReview.save();

    res.status(200).json(existingReview);
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ error: 'Server error while updating review' });
  }
};
