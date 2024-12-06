//! Middleware to check if the user is login or not:

const Listing = require("./modules/listing.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utilities/express_error.js");
const Review = require("./modules/reviews.js");

module.exports.isLoggedIn = (req, res, next) => {
  req.session.redirectUrl = req.originalUrl;
  if (!req.isAuthenticated()) {
    req.flash("error", "You must logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//! Validation for listing Schema:
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.errMsg).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//! Validation for review Schema:
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.errMsg).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//! Restricting listing modifications access to other users:
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of the listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//! Restricting reviews deletion access to other users:
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash(
      "error",
      "You are not the owner of the review! You can not delete it."
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};
