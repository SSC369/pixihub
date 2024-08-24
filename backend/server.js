const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });
const authRoutes = require("./routes/userRoutes");
const imageRoutes = require("./routes/imageRoutes");
const likeRoutes = require("./routes/likeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const followerRoutes = require("./routes/followerRoutes");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/collection", collectionRoutes);
app.use("/api/follower", followerRoutes);

app.listen(3000, () => {
  console.log("Server is running on 3000 port");
});

const mongoUri = process.env.MONGODB_CONNECTION_LINK;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to mongo Successful");
  } catch (error) {
    console.log(error.message);
  }
};

connectToMongo();
