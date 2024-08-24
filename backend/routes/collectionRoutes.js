const router = require("express").Router();

const {
  createCollection,
  getCollections,
  addImage,
  collectionDetails,
  removeImage,
  deleteCollection,
} = require("../controllers/collectionController");
const validateUser = require("../middlewares/validateUser");

router.post("/create-collection", validateUser, createCollection);
router.get("/get-collections", validateUser, getCollections);
router.put("/add-image", validateUser, addImage);
router.put("/remove-image/:collectionId/:imageId", removeImage);
router.delete("/:collectionId", deleteCollection);
router.get("/:collectionId", collectionDetails);
module.exports = router;
