const router = require("express").Router();

const {
  addImage,
  getAssets,
  getImageDetails,
  getImages,
  deleteImage,
} = require("../controllers/imageController");
const validateUser = require("../middlewares/validateUser");

router.post("/addimage", validateUser, addImage);
router.get("/getAssets/:userId", getAssets);
router.get("/getimage/:imageId", getImageDetails);
router.get("/get-images", getImages);
router.delete("/delete-image/:imageId", deleteImage);

module.exports = router;
