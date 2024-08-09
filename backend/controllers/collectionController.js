const Collection = require("../models/collectionModel");
const User = require("../models/userModel");
const Image = require("../models/imageModel");
const mongoose = require("mongoose");

module.exports.createCollection = async (req, res) => {
  try {
    const { name } = req.body;
    const { userId } = req.user;

    await Collection.create({
      name,
      createdBy: userId,
      date: new Date(),
      images: [],
    });

    res.status(201).json({
      msg: `${name} Collection Created`,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

module.exports.getCollections = async (req, res) => {
  try {
    const { userId } = req.user;
    const collections = await Collection.find({ createdBy: userId });

    res.status(200).json({ collections });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

module.exports.addImage = async (req, res) => {
  try {
    const { imageId, collectionId } = req.body;
    await Collection.findByIdAndUpdate(collectionId, {
      $addToSet: {
        images: imageId,
      },
    });
    res.status(204).json({ msg: "Image Added Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

module.exports.collectionDetails = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { createdBy, images, date, name } = await Collection.findById(
      collectionId
    );

    const { username, _id, profileImage } = await User.findById(createdBy);

    const imagesDetails = await Promise.all(
      images.map(async (id) => {
        const { imageUrl, _id, title } = await Image.findById(id);
        return {
          imageUrl,
          imageId: _id,
          title,
        };
      })
    );

    const collection = {
      userDetails: {
        username,
        _id,
        profileImage,
      },
      imagesDetails,
      date,
      name,
    };

    res.status(200).json({ collection });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

module.exports.removeImage = async (req, res) => {
  try {
    const { collectionId, imageId } = req.params;
    const objectImageId = new mongoose.Types.ObjectId(imageId);
    await Collection.findByIdAndUpdate(collectionId, {
      $pull: {
        images: objectImageId,
      },
    });
    res.status(200).json({ msg: "Image Removed" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

module.exports.deleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    await Collection.findByIdAndDelete(collectionId);
    res.status(200).json({ msg: "Collection Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};
