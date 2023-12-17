const mongoose = require("mongoose");

const database = () => {
  mongoose
    .connect(
      "mongodb+srv://ahmarjabbar7:Ahmar123@blockchain.4rjskdk.mongodb.net/blockchain"
    )
    .then((data) => {
      console.log(`Db connected successfully with ${data.connection.host}`);
    });
};

module.exports = database;
