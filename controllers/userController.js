let UserModel = require("../models/userModel");
// Usedto handle error
const errorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");
const getDataUri = require("../utils/dataUri");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwtToken = require("../utils/jwtToken");

const crypto = require("crypto");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const htmlModel = require("../models/htmlData");
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
    // role,
  } = req.body;
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
  let findUser = await UserModel.findOne({
    email: req.body.email,
  });
  if (findUser) {
    return next(
      new errorHandler("Email  already exists, please sign in to continue", 500)
    );
  }
  email.toLowerCase();

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
  });
  const token = await new Token({
    userId: createUser._id,
    token: crypto.randomBytes(32).toString("hex"),
  }).save();
  let subject = `Email Verification link`;
  const url = `${process.env.BASE_URL}/users/${createUser._id}/verify/${token.token}`;
  let text = `To activate your account, please click the following link: 

${url}
The link will be expired after 15 minutes`;
  await sendEmail(createUser.email, subject, text);
  res.status(201).send({
    msg: "A verification link has been sent to your email, please verify",
    success: true,
  });
  // jwtToken(createUser, 201, res);
});
exports.verifyToken = catchAsyncErrors(async (req, res, next) => {
  const user = await UserModel.findOne({ _id: req.params.id });
  if (!user) {
    return next(new errorHandler("Invalid link", 400));
  }

  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!token) {
    return next(new errorHandler("link expired", 400));
  }

  await UserModel.updateOne(
    { _id: user._id },
    { verified: true },
    { upsert: true, new: true }
  );
  await token.deleteOne();

  res.status(200).send({ msg: "Email verified successfully", success: true });
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if user has given password and email
  if (!email || !password) {
    return next(new errorHandler("Please enter email and password", 400));
  }
  let UserAuth = await UserModel.findOne({ email });

  if (!UserAuth) {
    return next(
      new errorHandler(
        "User not found with this email address, please register first!"
      )
    );
  }

  if (UserAuth.password != password) {
    return next(new errorHandler("Invalid Email or Password"));
  }
  if (!UserAuth.verified) {
    let token = await Token.findOne({ userId: UserAuth._id.toString() });
    if (!token) {
      token = await new Token({
        userId: UserAuth._id.toString(),
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      //
      let subject = `Email Verification link`;
      const url = `${
        process.env.BASE_URL
      }/users/${UserAuth._id.toString()}/verify/${token.token}`;
      let text = `To activate your account, please click the following link: 

${url}

The link will be expired after 2 minutes`;
      await sendEmail(UserAuth.email, subject, text);
      //
    } else if (token) {
      return res.status(400).send({
        success: false,

        msg: "A verification link has been already been sent to your email, please try again after 15 minutes",
      });
    }

    return res.status(400).send({
      success: false,

      msg: "A verification link has been sent to your email, please verify",
    });
  }

  jwtToken(UserAuth, 200, res);
});
exports.sendTicket = catchAsyncErrors(async (req, res, next) => {
  const { title, description, id } = req.body;
  let _id = id;
  // Checking if user has given password and email
  if (!title || !description) {
    return next(new errorHandler("Please fill both the requrired fields", 500));
  }
  if (description.length < 20) {
    return next(new errorHandler("Enter some detail in description", 500));
  }
  let userEmail = await UserModel.findById(_id);

  let newTitle = `Blochain user ticket`;
  let newDescription = `
From:
${userEmail.firstName}
${userEmail.email}


Ticket Title: 
${title}

Ticket Description:
${description}`;

  await sendEmail(process.env.USER, newTitle, newDescription);

  return res.status(200).send({
    success: true,

    msg: "Your ticket was sent. You will be answered by one of our representatives.",
  });
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
exports.htmlData = catchAsyncErrors(async (req, res, next) => {
  let description = await htmlModel.findOneAndUpdate(
    { _id: id },
    {
      description,
    },
    { new: true, upsert: true }
  );
  res.status(200).send({
    success: true,
    msg: "Description updated successfully",
    description,
  });
});
exports.getHtmlData = catchAsyncErrors(async (req, res, next) => {
  let description = await htmlModel.find();
  res.status(200).send({
    success: true,
    msg: "Description",
    description,
  });
});
exports.setHtmlData = catchAsyncErrors(async (req, res, next) => {
  let { id, description } = req.body;
  let descriptionUpdate = await htmlModel.findByIdAndUpdate(
    { _id: id },
    {
      description: description,
    },
    {
      upsert: true,
      new: true,
    }
  );
  res.status(200).send({
    success: true,
    msg: "Description Updated successfully",
    descriptionUpdate,
  });
});
exports.updateKyc = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  const { kyc, status } = req.body;

  let signleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      kyc: kyc,
      submitDoc: {
        status: status,
      },
    },
    { new: true, upsert: true }
  );

  res.status(200).send({
    success: true,
    msg: "User updated successfully",
    signleUser,
  });
});
exports.getsignUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.body;
  let signleUser = await UserModel.findById({ _id: id });
  res.status(200).send({
    success: true,
    msg: "Signle Users",
    signleUser,
  });
});
exports.verifySingleUser = catchAsyncErrors(async (req, res, next) => {
  let { id, cnic, bill } = req.body;

  let signleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      submitDoc: {
        status: "completed",
        cnic: cnic,
        bill: bill,
      },
    },
    { new: true, upsert: true }
  );
  signleUser.save();

  res.status(200).send({
    success: true,
    msg: "Thank you for submitting KYC documents.",
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
