const Image = require("../models/imageModel");
const User = require("../models/userModel");
const Like = require("../models/likeModel");
const Review = require("../models/reviewModel");

module.exports.addImage = async (req, res) => {
  try {
    const { imageUrl, date, title, tags, desc } = req.body;
    const { userId, email } = req.user;
    console.log(req.user);
    await Image.create({
      imageUrl,
      date,
      email,
      title,
      tags,
      userId,
      description: desc,
    });

    res.status(201).json({ msg: "Image uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

module.exports.getImageDetails = async (req, res) => {
  try {
    const { imageId } = req.params;

    const { _id, imageUrl, date, email, title, tags, description, userId } =
      await Image.findById(imageId);

    const { profileImage, username } = await User.findById(userId);

    return res.status(200).json({
      _id,
      imageUrl,
      date,
      email,
      title,
      tags,
      description,
      userId,
      username,
      profileImage,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

//assets of a user
module.exports.getAssets = async (req, res) => {
  try {
    const { email } = req.user;
    const assets = await Image.find({ email });
    res.status(200).json({ assets });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

module.exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    await Image.deleteOne({ _id: imageId });

    //update like, review
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

module.exports.editImage = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

// search query of an image
module.exports.queryImages = async (req, res) => {
  try {
    const { query } = req.query;
    const images = await Image.find();
    const filteredImages = images.filter((i) => i.title.includes(query));
    res.status(200).json({ images: filteredImages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

module.exports.getImages = async (req, res) => {
  try {
    const images = await Image.find();
    return res.status(200).json({ images });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server error" });
  }
};
