// All the listing routs:

const express = require("express");
const router = express.Router();
const wrap_async = require("../utilities/wrap_async.js");
const Listing = require("../modules/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  //! Route to show all listings: (index route)
  .get(wrap_async(listingController.index))

  //! Route to create a new listing:
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrap_async(listingController.createNewListing)
  );
//?

//! Route to create a new listing:
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  //! Route to show specific listing details:
  .get(wrap_async(listingController.showSpecificListing))

  //! Route to display 'updated' listing:
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrap_async(listingController.updateListing)
  )

  //! Route to 'delete' a listing:
  .delete(isLoggedIn, isOwner, wrap_async(listingController.deleteListing));
//?

//! Route to 'edit' a listing:
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrap_async(listingController.renderEditListingForm)
);

module.exports = router;
