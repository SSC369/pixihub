const router = require("express").Router();

const {
  addReview,
  getReviews,
  deleteReview,
} = require("../controllers/reviewController");
const validateUser = require("../middlewares/validateUser");
router.post("/add-review", validateUser, addReview);
router.get("/get-reviews/:imageId", getReviews);
router.delete("/delete-review/:reviewId", deleteReview);

module.exports = router;
