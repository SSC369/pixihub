const mongoose = require("mongoose");

const FollowerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //person who follow's user
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = new mongoose.model("Follower", FollowerSchema);
