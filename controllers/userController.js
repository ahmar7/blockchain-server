let UserModel = require("../models/userModel");
// Usedto handle error
const errorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");
const getDataUri = require("../utils/dataUri");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwtToken = require("../utils/jwtToken");

exports.RegisterUser = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    city,
    country,
    postalCode,
    role,
  } = req.body;
  let findUser = await UserModel.findOne({
    email: req.body.email,
  });
  if (findUser) {
    return next(
      new errorHandler("Email  already exists, please sign in to continue", 500)
    );
  }
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !address ||
    !city ||
    !country ||
    !postalCode
  ) {
    return next(new errorHandler("Please fill all the required fields", 500));
  }
  let createUser = await UserModel.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    address,
    city,
    note: "",
    country,
    postalCode,
    role,
  });
  // let userCoins = await userCoins.create({
  //   user: createUser._id,
  // });
  // A simple function, follow function path to read description
  jwtToken(createUser, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if user has given password and email
  if (!email || !password) {
    return next(new errorHandler("Please enter email and password", 400));
  }
  let UserAuth = await UserModel.findOne({ email });
  if (!UserAuth) {
    return next(new errorHandler("Invalid Email or password"));
  }

  if (UserAuth.password != password) {
    return next(new errorHandler("Invalid Email or Password"));
  }
  // A simple function, follow function path to read description

  jwtToken(UserAuth, 200, res);
});

// Logout User

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("jwttoken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).send({
    success: true,
    msg: "User Logged out successfully",
  });
});
exports.allUser = catchAsyncErrors(async (req, res, next) => {
  let allUsers = await UserModel.find();
  res.status(200).send({
    success: true,
    msg: "All Users",
    allUsers,
  });
});
exports.singleUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  let signleUser = await UserModel.findById({ _id: id });
  res.status(200).send({
    success: true,
    msg: "Signle Users",
    signleUser,
  });
});

exports.updateSingleUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    city,
    country,
    postalCode,
    note,
  } = req.body;
  if (!email || !password) {
    return next(
      new errorHandler("Email and password are required to for the user", 500)
    );
  }
  let signleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      city,
      country,
      postalCode,
      note,
    },
    { new: true }
  );
  res.status(200).send({
    success: true,
    msg: "User updated successfully",
    signleUser,
  });
});
exports.getsignUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.body;
  console.log("req.body: ", req.body);
  let signleUser = await UserModel.findById({ _id: id });
  res.status(200).send({
    success: true,
    msg: "Signle Users",
    signleUser,
  });
});
exports.verifySingleUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.body;
  console.log("req.body: ", req.body);
  console.log("id: ", id);

  let signleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      status: "completed",
    },
    { new: true, upsert: true }
  );
  signleUser.save();
  console.log("signleUser: ", signleUser);

  res.status(200).send({
    success: true,
    msg: "Congratulations, you have been verified! ",
    signleUser,
  });
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  let email = req.body.email;
  let user = await UserModel.findOne({ email });
  if (!user) {
    next(new errorHandler("user not found", 404));
  }

  return res.status(200).send({
    msg: "Done",
    // token,
    user,
  });
});
