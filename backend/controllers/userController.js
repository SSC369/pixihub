const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    //check that is there a same username exits
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }

    //check that is there a same email exists
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email is already registered!", status: false });
    }

    //create hashed pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const user = await User.findOne({ email });
    const secretKey = "SSC";
    const payload = {
      username: user.username,
      email,
      userId: user._id,
    };
    const jwtToken = await jwt.sign(payload, secretKey);

    return res.json({ status: true, jwtToken });
  } catch (error) {
    return res.json({ msg: "Server issue :(", status: false });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //authentication for user
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ msg: "Email is not registered!", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Password :(", status: false });

    const secretKey = "SSC";
    const payload = {
      username: user.username,
      email,
      userId: user._id,
    };
    const jwtToken = await jwt.sign(payload, secretKey);

    return res.status(200).json({ jwtToken });
  } catch (error) {
    return res.status(500).json({ msg: "Server issue :(" });
  }
};

module.exports.editProfile = async (req, res) => {
  try {
    const { username, password, profileImage } = req.body;
    const { email } = req.user;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.updateOne(
      { email },
      {
        $set: {
          username,
          password: hashedPassword,
          profileImage,
        },
      }
    );
    const user = await User.findOne({ email });
    const secretKey = "SSC";
    const payload = {
      username,
      email,
      userId: user._id,
    };
    const jwtToken = await jwt.sign(payload, secretKey);

    res.status(200).json({ msg: "Profile updated successfully", jwtToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server issue :(" });
  }
};

module.exports.userProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, profileImage, email } = await User.findById(userId);

    return res
      .status(200)
      .json({ userDetails: { username, profileImage, userId, email } });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Server issue :(" });
  }
};
