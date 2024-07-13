const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Image = new mongoose.model("Image", ImageSchema);
module.exports = Image;
