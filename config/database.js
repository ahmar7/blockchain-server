const mongoose = require("mongoose");

const database = () => {
  mongoose.connect(process.env.DATABASE).then((data) => {
    console.log(`Db connected successfully with ${data.connection.host}`);
  });
};

module.exports = database;
