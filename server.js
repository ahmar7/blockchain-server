const app = require("./app");
var bodyParser = require("body-parser");
const { errorMiddleware } = require("./middlewares/errorMiddleware");
// Database connect
app.use(bodyParser.urlencoded({ extended: false }));
const database = require("./config/database");
database();

app.get("/", async (req, res) => {
  res.send("working");
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
