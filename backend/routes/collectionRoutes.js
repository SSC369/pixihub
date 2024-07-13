const router = require("express").Router();

const {
  createCollection,
  getCollections,
  addImage,
  collectionDetails,
  removeImage,
} = require("../controllers/collectionController");
const validateUser = require("../middlewares/validateUser");

router.post("/create-collection", validateUser, createCollection);
router.get("/get-collections", validateUser, getCollections);
router.put("/add-image", validateUser, addImage);
router.delete("/remove-image/:collectionId/:imageId", removeImage);

router.get("/collection-details/:collectionId", collectionDetails);
module.exports = router;
