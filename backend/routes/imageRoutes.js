const router = require("express").Router();

const {
  addImage,
  getAssets,
  getImageDetails,
  getImages,
} = require("../controllers/imageController");
const validateUser = require("../middlewares/validateUser");

router.post("/addimage", validateUser, addImage);
router.get("/getAssets/:userId", getAssets);
router.get("/getimage/:imageId", getImageDetails);
router.get("/get-images", getImages);

module.exports = router;
