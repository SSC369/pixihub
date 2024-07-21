const { default: mongoose } = require("mongoose");
const Follower = require("../models/followerModel");
const User = require("../models/userModel");

module.exports.addFollower = async (req, res) => {
  try {
    const { userId, followerId } = req.body;

    const findFollowing = await Follower.findOne({
      userId,
      followerId,
    });
    if (findFollowing !== null) {
      res.status(200).json({
        msg: "Already followed",
      });
    }

    await Follower.create({
      userId,
      followerId,
      date: new Date(),
    });
    return res.status(201).json({ msg: "followed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

module.exports.removeFollower = async (req, res) => {
  try {
    const { userId, followerId } = req.params;

    const findFollowing = await Follower.findOne({
      userId,
      followerId,
    });

    if (findFollowing === null) {
      res.status(200).json({
        msg: "Already unfollowed",
      });
    }

    await Follower.deleteOne({
      followerId,
      userId,
    });
    return res.status(200).json({ msg: "Unfollowed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

module.exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await Follower.find({ userId });
    return res.status(200).json({ followers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

module.exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const followingData = await Follower.find({ followerId: userId });
    return res.status(200).json({ followingData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

module.exports.isFollowing = async (req, res) => {
  try {
    const { userId, followerId } = req.params;
    // When you pass userId and followerId as strings in the query object, Mongoose will automatically attempt to convert these strings to ObjectId types if the schema specifies that these fields are ObjectId.
    //     const { userId, followerId } = req.params; // userId and followerId are strings
    // const data = await Follower.findOne({
    //   userId: mongoose.Types.ObjectId(userId), // Explicit conversion (optional)
    //   followerId: mongoose.Types.ObjectId(followerId), // Explicit conversion (optional)
    // });
    const data = await Follower.findOne({
      userId,
      followerId,
    });
    res
      .status(200)
      .json(data !== null ? { following: true } : { following: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};
