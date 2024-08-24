const router = require("express").Router();

const {
  addLike,
  removeLike,
  userLike,
  getImagesLikes,
  favorites,
} = require("../controllers/likeController");
const validateUser = require("../middlewares/validateUser");

router.post("/add-like", validateUser, addLike);
router.delete("/remove-like/:imageId", validateUser, removeLike);
router.get("/user-like/:imageId", validateUser, userLike);
router.get("/image-likes/:imageId", getImagesLikes);
router.get("/favorites", validateUser, favorites);

module.exports = router;
