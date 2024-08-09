const Image = require("../models/imageModel");
const User = require("../models/userModel");
const Like = require("../models/likeModel");
const Collection = require("../models/collectionModel");
const Review = require("../models/reviewModel");
const { default: mongoose } = require("mongoose");

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
    const { userId } = req.params;
    const assets = await Image.find({
      userId: new mongoose.Types.ObjectId(userId),
    });
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
    await Like.deleteMany({ imageId });
    await Review.deleteMany({ imageId });

    const collections = await Collection.find();

    for (const c of collections) {
      const { images, _id } = c;
      const filteredImages = images.filter(
        (id) => !id.equals(new mongoose.Types.ObjectId(imageId))
      );
      await Collection.findByIdAndUpdate(_id, {
        $set: {
          images: filteredImages,
        },
      });
    }
    res.status(200).json({ msg: "Image Deleted" });
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

module.exports.getRandomImages = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
