let userCoins = require("../models/userCoins");
const errorHandler = require("../utils/errorHandler");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwtToken = require("../utils/jwtToken");
const userModel = require("../models/userModel");

exports.addCoins = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  let createCoin = await userCoins.findOneAndUpdate(
    { user: id },
    { user: id },
    {
      new: true,
      upsert: true,
    }
  );
  res.status(200).send({
    success: true,
    msg: "Done",
    createCoin,
  });
});
exports.getCoins = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  let getCoin = await userCoins.findOne({ user: id });
  res.status(200).send({
    success: true,
    msg: "Done",
    getCoin,
  });
});
exports.getCoinsUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.body;
  console.log("req.body: ", req.body);
  let getCoin = await userCoins.findOne({ user: id });
  res.status(200).send({
    success: true,
    msg: "Done",
    getCoin,
  });
});
exports.updateCoinAddress = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  let { usdtTokenAddress, ethTokenAddress, btcTokenAddress } = req.body;
  if (!usdtTokenAddress || !ethTokenAddress || !btcTokenAddress) {
    return next(new errorHandler("Please fill all the required fields", 500));
  }
  let getCoin = await userCoins.findOneAndUpdate(
    { user: id },
    {
      usdtTokenAddress,
      ethTokenAddress,
      btcTokenAddress,
    },
    {
      new: true,
    }
  );
  res.status(200).send({
    success: true,
    msg: "Address Updated successfully",
    getCoin,
  });
});

exports.createTransaction = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  let {
    trxName,
    amount,
    txId,
    fromAddress,
    status,
    note,
    ethBalance,
    btcBalance,
    usdtBalance,
  } = req.body;
  if (!trxName || !amount || !txId || !status || !fromAddress) {
    return next(new errorHandler("Please fill all the required fields", 500));
  }
  let Transaction = await userCoins.findOneAndUpdate(
    { user: id },
    {
      $push: {
        transactions: { trxName, amount, txId, fromAddress, status, note },
        ethBalance,
        btcBalance,
        usdtBalance,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );
  res.status(200).send({
    success: true,
    msg: "Transaction created successfully",
    Transaction,
  });
});
exports.getTransactions = catchAsyncErrors(async (req, res, next) => {
  let Transaction = await userCoins.find();

  res.status(200).send({
    success: true,
    msg: " ",
    Transaction,
  });
});
exports.getEachUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;

  let getCoin = await userCoins.findOne({ "transactions._id": req.params.id });

  let signleUser = await userModel.findById({ _id: getCoin.user });
  if (signleUser) {
    res.status(200).send({
      success: true,
      signleUser,
    });
  }
});

exports.updateTransaction = catchAsyncErrors(async (req, res, next) => {
  let { _id } = req.body;

  let getCoin = await userCoins.updateOne(
    { "transactions._id": _id },
    {
      $set: { "transactions.$": req.body },
    },
    {
      new: true,
    }
  );

  res.status(200).send({
    success: true,
    msg: "Transaction status updated successfully",
    // getCoin,
  });
});
