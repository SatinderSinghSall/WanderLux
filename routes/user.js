// All the routes for user signup:

const express = require("express");
const router = express.Router();
const wrap_async = require("../utilities/wrap_async");
const passport = require("passport");
const e = require("connect-flash");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  //! Route to signup a user:
  .get(userController.signupForm)

  //! Route to store users signup data:
  .post(wrap_async(userController.signupUser));
//?

router
  .route("/login")
  //! Route to login the user:
  .get(userController.loginForm)

  //! Route to login the user into the database:
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser
  );
//?

//! Route to logout the user:
router.get("/logout", userController.logOutUser);

module.exports = router;
