const Express = require("express");
const projectRoute = Express.Router();
const mongoose = require("mongoose");
const userAuth = require("../middleware/authMiddleware");
const { User } = require("./user");

const projectSchema = new mongoose.Schema({
  id: { type: Number },
  projectName: { type: String, required: true },
  projectCode: String,
  projectDescription: String,
  status: String,
  assignedTo: { type: [String], default: [] },
  assignedTasks: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tasks" }],
    default: [],
  },
  progressTillNow: { type: Number, default: 0 },
  projectStartDate: { type: Date, required: true },
  projectEndDate: { type: Date, required: true },
  dateCreated: { type: Date, default: Date.now },
  dateUpdate: { type: Date, default: Date.now },
});

const Project = mongoose.model("Projects", projectSchema);

projectRoute.get("/getProjectList", async (req, res) => {
  const result = await Project.find();
  res.status(200).send(result);
  res.end();
});

projectRoute.post("/getProjectList", userAuth, async (req, res) => {
  let { search, sortField, order, pageNo, perPage, userId } = req.body;
  const result = await Project.find({
    $or: [
      { projectName: { $regex: search, $options: "i" } },
      { projectCode: { $regex: search, $options: "i" } },
      { projectDescription: { $regex: search, $options: "i" } },
    ],
    assignedTo: [userId],
  })
    .sort({ [sortField]: order === "asc" ? 1 : -1 })
    .skip((pageNo - 1) * perPage)
    .limit(perPage);
  res
    .status(200)
    .send({ list: result, pagination: { totalRow: result.length } });
  res.end();
});

projectRoute.get("/getProjectDetails/:id", async (req, res) => {
  const result = await Project.find(
    { _id: req.params.id },
    { assignedTasks: 0 },
  );
  res.status(200).send(...result);
  res.end();
});

projectRoute.get("/getAssignedProject/:userId", async (req, res) => {
  const result = await User.find({ _id: req.params.userId });
  res.status(200).send(...result);
  res.end();
});

projectRoute.post("/addProject", async (req, res) => {
  // console.log("reqqq", req.body);
  if (req.body.projectStartDate) {
    console.log("startDate", req.body.projectStartDate);
  }
  const result = await addProject(req.body);
  res.send(result);
  res.end();
});

projectRoute.put("/updateProject", async (req, res) => {
  const result = await updateProject(req.body);
  res.send("Data Updated");
  res.end();
});

projectRoute.delete("/deleteProject/:id", async (req, res) => {
  const result = deleteRecord(req.params.id);
  res.status(200).send(result);
  res.end();
});

projectRoute.post("/assignProject", async (req, res) => {
  const result = await assignToUser(req.body);
  // const result = deleteRecord(req.params.id);
  res.status(200).send(result);
  res.end();
});

const addProject = async (values) => {
  const projectsList = await Project.find();
  const project = new Project({
    projectName: values.projectName,
    projectCode: values.projectCode,
    projectDescription: values.projectDescription,
    status: values.status,
    id: projectsList.length,
    projectStartDate: values.projectStartDate,
    projectEndDate: values.projectEndDate,
  });
  console.log("valesadd", values);
  // try {
  const result = await project.save();
  return result;
  // } catch (error) {
  //   console.log("error in add project :", error);
  //   return { error: error };
  // }
};

const deleteRecord = async (id) => {
  const result = await Project.deleteOne({ _id: id });
  return result;
};

const updateProject = async (values) => {
  const result = await Project.updateOne(
    { _id: values.id },
    {
      $set: {
        projectName: values.projectName,
        projectCode: values.projectCode,
        projectDescription: values.projectDescription,
        status: values.status,
        progressTillNow: values.progressTillNow,
        dateUpdate: Date.now,
      },
    },
  );
};

const assignToUser = async (values) => {
  const user = await User.findOne({ _id: values.userId });
  if (user.assignedProjects.includes(values.projectid)) {
    return "Already Assinged";
  }
  const result = await User.updateOne(
    { _id: values.userId },
    {
      $set: {
        assignedProjects: [...user.assignedProjects, values.projectid],
        dateUpdate: Date.now,
      },
    },
  );
  return result;
};

module.exports = projectRoute;
module.exports.Project = Project;
