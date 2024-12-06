// Controller: Call Backs of Users Route:

const User = require("../modules/user.js");

//! Route to signup a user Callback:
module.exports.signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

//! Route to store users signup data Callback:
module.exports.signupUser = async (req, res, next) => {
  // Added `next` here
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); // `next` is now available to handle errors
      } else {
        req.flash("success", "User registered successfully!");
        res.redirect("/listings");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//! Route to login the user Callback:
module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
};

//! Route to login the user into the database Callback:
module.exports.loginUser = async (req, res, next) => {
  // Added `next` here for consistency
  req.flash("success", "Welcome back to WanderLux: You are logged in!");
  const redirectUrl = res.locals.redirectUrl || "/listings"; // Fallback if not set
  res.redirect(redirectUrl);
};

//! Route to logout the user Callback:
module.exports.logOutUser = (req, res, next) => {
  // Added `next` here
  req.logout((err) => {
    if (err) {
      return next(err); // `next` is now available to handle errors
    }
    req.flash("success", "You have successfully logged out!");
    res.redirect("/listings");
  });
};
