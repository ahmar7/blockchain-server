const app = require("./app");
var bodyParser = require("body-parser");
const { errorMiddleware } = require("./middlewares/errorMiddleware");
// Database connect
app.use(bodyParser.urlencoded({ extended: false }));
const database = require("./config/database");
database();

const cloudinary = require("cloudinary");

app.get("/", async (req, res) => {
  res.send("working");
  console.log("working");
});
let PORT = process.env.PORT || 4000;
cloudinary.v2.config({
  cloud_name: "dzkk7ubqq",
  api_key: "889131577884438",
  api_secret: "AVh8qLZkL5EFPlkHdmc78YqGNmI",
});
app.use(errorMiddleware);

let server = app.listen(process.env.PORT, () => {
  console.log(`server is running at ${process.env.PORT}`);
});

// Unhandled promise rejection like if the db server error, it will shutdown the server

// process.on("unhandledRejection", (err) => {
//   console.log("Error: ", err.message);
//   console.log("Shutting down the server due to Unhandled Promise Rejection");
//   server.close(() => {
//     process.exit();
//   });
// });
