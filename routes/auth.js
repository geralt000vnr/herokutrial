const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(422).send(error.details[0]);
  //   console.log("error consoled clg>>>>>>>", error);
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(422).send("Invalid Email Or Password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(422).send("Invalid Email Or Passwordssss");
  const token = jwt.sign({ _id: user._id }, "jwtprivatekey");
  res
    // .send("Register User Request Send Successfully")
    .send({ token: token })
    .status(200);
});

function validateUser(req) {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });
  return schema.validate(req);
}

module.exports = router;
