const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 50 });
module.exports = mongoose.model("token", tokenSchema);