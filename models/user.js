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
    phone: {
      type: Number,
      required: true,
      minlength: 8,
      maxlength: 12,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    gender: {
      type: String,
      required: true,
    },
    currentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    dob: {
      type: Date,
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    profileDescription: String,
    education: [
      {
        qualification: { type: String, required: true },
        passingYear: { type: Number, required: true },
        educationalBoard: String,
      },
    ],
    experience: [
      {
        businessName: { type: String, required: true },
        joiningDate: { type: Date, required: true },
        relievingDate: { type: Date, required: true },
        designation: { type: String, required: true },
      },
    ],
    designation: [
      {
        type: String,
      },
    ],
    department: {
      type: String,
      default: "",
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teams",
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
    availablity: {
      type: String,
      default: "",
    },
    employeeId: Number,
  }),
);

// const User = mongoose.model(
//   "User",
//   new mongoose.Schema({
//     firstName: {
//       type: String,
//       required: true,
//       minlength: 2,
//       maxlength: 50,
//     },
//     lastName: {
//       type: String,
//       required: true,
//       minlength: 2,
//       maxlength: 50,
//     },
//     fullName: {
//       type: String,
//       required: true,
//       minlength: 2,
//       maxlength: 100,
//     },
//     email: {
//       type: String,
//       required: true,
//       minlength: 5,
//       maxlength: 255,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 5,
//       maxlength: 1024,
//     },
//     profilePic: {
//       type: String,
//     },
//     degination: [
//       {
//         type: String,
//       },
//     ],
//     department: {
//       type: String,
//       default: "",
//     },
//     workingOnProject: {
//       type: String,
//       default: "",
//     },
//     assignedProjects: [
//       {
//         type: String,
//       },
//     ],
//     assignedTasks: [
//       {
//         type: String,
//       },
//     ],
//     role: {
//       type: String,
//       default: "Employee",
//     },
//     // profilePic: {
//     //   data: Buffer,
//     //   contentType: String,
//     // },
//   }),
// );

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
