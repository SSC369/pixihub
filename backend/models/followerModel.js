const mongoose = require("mongoose");

const FollowerSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  //person who follow's user
  followerEmail: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});
