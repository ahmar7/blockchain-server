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
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(
  cors({
    origin: process.env.CORS,

    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);
// All Routes
const coins = require("./routes/coinRoute");
const user = require("./routes/userRoute");
app.use("/api/v1", coins);
app.use("/api/v1", user);

module.exports = app;
