const router = require("express").Router();

const validateUser = require("../middlewares/validateUser");
const {
  getFollowers,
  getFollowing,
} = require("../controllers/followerController");

router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);
module.exports = router;
