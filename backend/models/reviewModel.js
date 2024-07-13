const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Image",
  },
  review: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("Review", ReviewSchema);
