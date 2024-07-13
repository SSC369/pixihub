const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  },
});

const Like = new mongoose.model("Like", LikeSchema);
module.exports = Like;
