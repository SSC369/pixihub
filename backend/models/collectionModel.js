const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = new mongoose.model("Collection", CollectionSchema);
