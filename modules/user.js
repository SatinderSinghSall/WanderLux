// User data into MongoDB Database:

const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport_local_mongoose = require("passport-local-mongoose");

//! Schema for Database:
const userSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
});

userSchema.plugin(passport_local_mongoose);

module.exports = mongoose.model("User", userSchema);
