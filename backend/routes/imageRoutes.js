const router = require("express").Router();

const {
  addImage,
  getAssets,
  getImageDetails,
  getImages,
} = require("../controllers/imageController");
const validateUser = require("../middlewares/validateUser");

router.post("/addimage", validateUser, addImage);
router.get("/getAssets", validateUser, getAssets);
router.get("/getimage/:imageId", validateUser, getImageDetails);
router.get("/get-images", getImages);

module.exports = router;
