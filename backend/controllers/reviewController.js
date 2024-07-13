const Review = require("../models/reviewModel");
const User = require("../models/userModel");

module.exports.addReview = async (req, res) => {
  try {
    const { review, date, imageId } = req.body;
    const { email } = req.user;
    await Review.create({
      imageId,
      review,
      date,
      userEmail: email,
    });

    return res.status(201).json({ msg: "Review Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

module.exports.editReview = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { review, date } = req.body;

    await Review.findOneAndUpdate(
      { imageId },
      {
        $set: {
          review,
          date,
        },
      }
    );
    return res.status(200).json({ msg: "Review Edited" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

module.exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    return res.status(200).json({ msg: "Review deleted!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

module.exports.getReviews = async (req, res) => {
  try {
    const { imageId } = req.params;
    const data = await Review.find({ imageId });

    const reviews = await Promise.all(
      data.map(async (r) => {
        const { userEmail, review, imageId, date, _id } = r;
        const {
          username,
          profileImage,
          _id: userId,
        } = await User.findOne({
          email: userEmail,
        });

        return {
          reviewId: _id,
          review,
          imageId,
          date,
          username,
          profileImage,
          userId,
        };
      })
    );

    return res.status(200).json({ reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server error" });
  }
};
