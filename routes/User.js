const mongoose = require("mongoose");
const { User, validate, validateUserProfile } = require("../models/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const userAuth = require("../middleware/authMiddleware");

const uniqueSuffix =
  "user_" + Date.now() + "-" + Math.round(Math.random() * 1e9) + ".";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    // const uniqueSuffix = uniqueSuffix + ext;
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

router.post("/addUser", upload.single("profilePic"), async (req, res) => {
  const { error } = validate(req.body);
  const imageValidation = validateUserProfile(req.files);
  if (error) return res.send(error.details[0].message).status(422);
  if (imageValidation.error)
    return res.send(error.details[0].message).status(422);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(422).send("User Already Exists With This Email");
  let obj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    fullName: req.body.firstName + " " + req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    dateCreate: { type: Date, default: Date.now },
    dateUpdate: { type: Date, default: Date.now },
    profilePic:
      "/uploads/" +
      req.file.fieldname +
      "-" +
      uniqueSuffix +
      req.file.mimetype.split("/")[1],
    // profilePic: {
    //   data: fs.readFileSync("uploads/" + req.file.filename),
    //   contentType: "image/png",
    // },
  };
  user = new User(obj);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res
    // .send("Register User Request Send Successfully")
    .send(_.pick(user, ["firstName", "lastName", "email", "profilePic"]))
    .status(200);
});

router.get("/getUserDetails/:id", async (req, res) => {
  // to do check _id, it stops from second user login issue, not confirm
  let user = await User.findById(req.params.id);
  res.status(200).send(user);
});

router.get("/getUserList", async (req, res) => {
  // to do check _id, it stops from second user login issue, not confirm
  let user = await User.find();
  res.status(200).send(user);
});

router.post("/getUserList", async (req, res) => {
  // to do check _id, it stops from second user login issue, not confirm
  let { search, sortField, order, pageNo, perPage } = req.body;
  let user = await User.find({
    $or: [
      { fullName: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
      { workingOnProject: { $regex: search, $options: "i" } },
    ],
  })
    .sort({ [sortField]: order === "asc" ? 1 : -1 })
    .skip((pageNo - 1) * perPage)
    .limit(perPage);
  res.status(200).send({ list: user, pagination: { totalRows: user.length } });
});

router.get("/me", userAuth, async (req, res) => {
  let { userId } = req.body;
  let details = await User.findById(userId);
  res.status(200).send(details);
});

module.exports = router;
