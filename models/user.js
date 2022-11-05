const { string } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    fullName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    profilePic: {
      type: String,
    },
    degination: [
      {
        type: String,
      },
    ],
    department: {
      type: String,
      default: "",
    },
    workingOnProject: {
      type: String,
      default: "",
    },
    assignedProjects: [
      {
        type: String,
      },
    ],
    assignedTasks: [
      {
        type: String,
      },
    ],
    role: {
      type: String,
      default: "Employee",
    },
    // profilePic: {
    //   data: Buffer,
    //   contentType: String,
    // },
  }),
);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),

    lastName: Joi.string().min(3).max(30).required(),

    fullName: Joi.string().min(3).max(30).required(),

    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });
  return schema.validate(user);
}
function validateUserProfile(profilePic) {
  const schema = Joi.object({
    profilePic: Joi.any().required(),
  });
  return schema.validate(profilePic);
}

exports.User = User;
exports.validate = validateUser;
exports.validateUserProfile = validateUserProfile;
