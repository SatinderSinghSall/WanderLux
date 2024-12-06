// Controller: Call Backs of Reviews Route:

const Review = require("../modules/reviews.js");
const Listing = require("../modules/listing.js");

//! Route to post a Reviews Callback:
module.exports.addReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Added!");
  res.redirect(`/listings/${listing._id}`);
};

//! Route to delete a Review Callback:
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted.");
  res.redirect(`/listings/${id}`);
};
