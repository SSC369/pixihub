const router = require("express").Router();

const {
  addLike,
  removeLike,
  userLike,
  getImagesLikes,
} = require("../controllers/likeController");
const validateUser = require("../middlewares/validateUser");

router.post("/add-like", validateUser, addLike);
router.delete("/remove-like/:imageId", validateUser, removeLike);
router.get("/user-like/:imageId", validateUser, userLike);
router.get("/image-likes/:imageId", getImagesLikes);

module.exports = router;
