const mongoose = require("mongoose");

const database = () => {
  mongoose
    .connect(
      "mongodb+srv://ahmarjabbar7:Ahmar123@blockchain.4rjskdk.mongodb.net/blockchain"
    )
    .then((data) => {
      console.log(`Db connected successfully with ${data.connection.host}`);
    })
    .catch((e) => {
      console.log("db error", e);
    });
};

module.exports = database;
