const express = require("express");
const app = express();
const bodyparser = require("body-parser");

// Environment file set
const dotnet = require("dotenv");
dotnet.config({ path: "./config/config.env" });
const cors = require("cors");
app.use(express.json());
let cookieParser = require("cookie-parser");
app.use(cookieParser());
//
let ALLOWED_ORIGINS = [
  "https://blockchain-frontend-one.vercel.app",
  "https://blockchainsltd.com",
  "https://www.blockchainsltd.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
];
app.use((req, res, next) => {
  let origin = req.headers.origin;
  let theOrigin =
    ALLOWED_ORIGINS.indexOf(origin) >= 0 ? origin : ALLOWED_ORIGINS[0];
  res.header("Access-Control-Allow-Origin", theOrigin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  res.header("Access-Control-Allow-Credentials", true);

  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});
//
// app.use(
//   cors({
//     origin: process.env.CORS,

//     credentials: true,
//     exposedHeaders: ["Set-Cookie"],
//   })
// );
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
// All Routes
const coins = require("./routes/coinRoute");
const user = require("./routes/userRoute");
app.use("/api/v1", coins);
app.use("/api/v1", user);

module.exports = app;
