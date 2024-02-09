const Express = require("express");
const commonCompRoute = Express.Router();
const mongoose = require("mongoose");
const userAuth = require("./middleware/authMiddleware");
const { Project } = require("./models/Projects");
const Team = require("./models/team");
const { User } = require("./models/user");

const commonComponentSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  type: { type: String, required: true },
});

const CommonComponents = mongoose.model(
  "CommonComponents",
  commonComponentSchema,
);

commonCompRoute.post("/getCommonComponent", userAuth, async (req, res) => {
  let { valuesRequired, userId } = req.body;

  var promise = new Promise(async function (resolve, reject) {
    let responseObj = {};
    try {
      if (valuesRequired.includes("taskStatus")) {
        responseObj.taskStatus = await CommonComponents.find();
      }
      if (valuesRequired.includes("userList")) {
        responseObj.userList = await User.find(
          {},
          { label: "$fullName", value: "$_id" },
        );
        // responseObj.userList = await User.find();
      }
      if (valuesRequired.includes("roleList")) {
        responseObj.roleList = await CommonComponents.find({ type: "role" });
      }
      if (valuesRequired.includes("departmentList")) {
        responseObj.departmentList = await CommonComponents.find({
          type: "department",
        });
      }
      if (valuesRequired.includes("designationList")) {
        responseObj.designationList = await CommonComponents.find({
          type: "designation",
        });
      }
      if (valuesRequired.includes("genderList")) {
        responseObj.genderList = await CommonComponents.find({
          type: "gender",
        });
      }
      if (valuesRequired.includes("projectList")) {
        responseObj.ProjectList = await Project.find(
          {
            assignedTo: [userId],
          },
          { value: "$_id", label: "$projectName" },
        );
      }
      if (valuesRequired.includes("teamList")) {
        responseObj.teamList = await Team.find(
          {},
          { value: "$_id", label: "$teamName" },
        );
      }
      resolve(responseObj);
    } catch (error) {
      reject(error);
    }
  });
  promise
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      console.error("error", err);
    });
});

module.exports = commonCompRoute;
