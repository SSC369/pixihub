const Follower = require("../models/followerModel");
const User = require("../models/userModel");

module.exports.addFollower = async (req, res) => {
  try {
    const { userId, followerId } = req.body;

    await Follower.create({
      userId,
      followerId,
      date: new Date(),
    });
    return res.status(200).json({ msg: "followed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

module.exports.removeFollower = async (req, res) => {
  try {
    const { email: followerEmail } = req.user;
    const { userId } = req.params;
    const { email } = await User.findById(userId);
    await Follower.deleteOne({
      followerEmail,
      userEmail: email,
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
