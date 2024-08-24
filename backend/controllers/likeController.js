const Image = require("../models/imageModel");
const Like = require("../models/likeModel");

module.exports.addLike = async (req, res) => {
  try {
    const { imageId } = req.body;
    const { email } = req.user;

    const isLiked = await Like.findOne({ userEmail: email, imageId });
    if (isLiked) return;

    await Like.create({
      imageId,
      userEmail: email,
    });
    return res.status(201).json({ msg: "Liked!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

module.exports.removeLike = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { email } = req.user;
    const isLiked = await Like.findOne({ userEmail: email, imageId });
    if (isLiked === null) return;

    await Like.deleteOne({ imageId, userEmail: email });
    return res.status(200).json({ msg: "Unliked" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

module.exports.getImagesLikes = async (req, res) => {
  try {
    const { imageId } = req.params;
    const results = await Like.find({ imageId });
    return res.status(200).json({ likesCount: results.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

module.exports.userLike = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { email } = req.user;
    const like = await Like.findOne({ imageId, userEmail: email });
    return res.status(200).json({ liked: like ? true : false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

module.exports.favorites = async (req, res) => {
  try {
    const { email } = req.user;
    const likesData = await Like.find({ userEmail: email });
    const favorites = await Promise.all(
      likesData.map(async (l) => {
        const { imageId } = l;
        const { imageUrl, title } = await Image.findById(imageId);
        return {
          imageId,
          imageUrl,
          title,
        };
      })
    );

    res.status(200).json({ favorites });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
