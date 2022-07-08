const mongoose = require("mongoose");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");

router.post("/addUser", async (req, res) => {
  console.log("clggged", req.body);
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message).status(422);
  //   console.log("error consoled clg>>>>>>>", error);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(422).send("User Already Exists With This Email");
  //   .send(error);
  user = new User(
    _.pick(req.body, ["firstName", "lastName", "email", "password"]),
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res
    // .send("Register User Request Send Successfully")
    .send(_.pick(user, ["firstName", "lastName", "email"]))
    .status(200);
});

module.exports = router;
