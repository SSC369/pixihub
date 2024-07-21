const router = require("express").Router();

const validateUser = require("../middlewares/validateUser");
const {
  getFollowers,
  getFollowing,
  addFollower,
  removeFollower,
  isFollowing,
} = require("../controllers/followerController");

router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);
router.post("/add-follower", addFollower);
router.delete("/remove-follower/:userId/:followerId", removeFollower);
router.get("/isFollowing/:userId/:followerId", isFollowing);
module.exports = router;
