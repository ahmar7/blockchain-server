const express = require("express");
const app = express();

// Environment file set
const dotnet = require("dotenv");
dotnet.config({ path: "./config/config.env" });
const cors = require("cors");
app.use(express.json());
let cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(
  cors({
    origin: "https://blockchain-frontend-one.vercel.app",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],

    credentials: true,
  })
);
// All Routes
const coins = require("./routes/coinRoute");
const user = require("./routes/userRoute");
app.use("/api/v1", coins);
app.use("/api/v1", user);

module.exports = app;
