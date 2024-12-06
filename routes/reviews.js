// All the reviews routs:

const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../modules/listing.js");
const wrap_async = require("../utilities/wrap_async.js");
const ExpressError = require("../utilities/express_error.js");
const Review = require("../modules/reviews.js");
const {
  validateReview,
  isReviewAuthor,
  isLoggedIn,
} = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");

//! Route to post a Reviews:
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrap_async(reviewsController.addReview)
);

//! Route to delete a Review:
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrap_async(reviewsController.deleteReview)
);

module.exports = router;
