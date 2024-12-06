if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const database_url = process.env.MONGO_DB_ATLAS_DATABASE_URL;
const path = require("path");
const method_override = require("method-override");
const ejs_mate = require("ejs-mate");
const express_error = require("./utilities/express_error.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const express_session = require("express-session");
const MongoStore = require("connect-mongo");
const connect_flash = require("connect-flash");
const passport = require("passport");
const passport_local = require("passport-local");
const User = require("./modules/user.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(method_override("_method"));
app.engine("ejs", ejs_mate);
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`\nApp's server is running in port: ${port}!\n`);
});

async function main() {
  await mongoose.connect(database_url);
}

main()
  .then(() => {
    console.log("MongoDB database connection successful!\n");
  })
  .catch((err) => {
    console.log(err);
  });
//

const store = MongoStore.create({
  mongoUrl: database_url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("err", () => {
  console.log("ERROR: Error in MongoDB session store!", err);
});

const session_options = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(express_session(session_options));
app.use(connect_flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passport_local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//! About the developer route:
app.get("/developer", (req, res) => {
  res.render(__dirname + "/public/ejs/developer.ejs");
});

//! All the listings routes:
app.use("/listings", listings);

//! All the reviews routes:
app.use("/listings/:id/reviews", reviews);

//! User router:
app.use("/", userRouter);

//! Invalid directory message:
app.all("*", (req, res, next) => {
  next(new express_error(404, "Page Not Found!"));
});

//! Custom Error Handling (Middleware)
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error/error.ejs", { statusCode, message });
  // res.status(statusCode).send(message);
});
