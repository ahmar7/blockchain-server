const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

let userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name can't exceed 30 characters"],
    minLength: [2, "Name will have more than 3 characters"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name can't exceed 30 characters"],
    minLength: [2, "Name will have more than 3 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: [true, "Email already exists"],
    validate: [validator.isEmail, "Please enter a valid Email"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Number"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your Password"],
    minLength: [8, "Password should be more than 8 characters"],
    // It will not come in find() method
  },
  address: {
    type: String,
    required: [true, "Please enter your Address"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "Please enter your City"],
    trim: true,
  },
  country: {
    type: String,
    required: [true, "Please enter your Country"],
    trim: true,
  },
  postalCode: {
    type: String,
    required: [true, "Please enter add postal code"],
    trim: true,
  },
  note: {
    type: String,
    trim: true,
    default: "",
  },

  ticket: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      status: {
        type: String,
      },
      answer: {
        type: String,
      },
    },
  ],

  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.SECRET_JWT, {
    expiresIn: process.env.SECRET_EXPIRE,
  });
};

userSchema.methods.resetPasswordTokenGenerator = async function () {
  // generating token
  let restToken = crypto.randomBytes(20).toString("hex");
  // Making hash of restToken and add to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(restToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
};

let userModel = mongoose.model("user", userSchema);

module.exports = userModel;
