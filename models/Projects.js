const Express = require("express");
const projectRoute = Express.Router();
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  //   id: { type: Number, required: true },
  projectName: { type: String, required: true },
  projectCode: String,
  discription: String,
  status: String,
  assignedTo: [String],
  progressTillNow: Number,
  dateCreated: { type: Date, default: Date.now },
  dateUpdate: { type: Date, default: Date.now },
});

const Project = mongoose.model("Projects", projectSchema);

projectRoute.get("/getProjectList", async (req, res) => {
  const result = await Project.find();
  console.log("result", result);
  res.status(200).send(result);
  res.end();
});

projectRoute.get("/getProjectDetails/:id", async (req, res) => {
  const result = await Project.find({ _id: req.params.id });
  res.status(200).send(...result);
  res.end();
});

projectRoute.post("/addProject", async (req, res) => {
  const result = await addTask(req.body);
  console.log("reqqq", req.params);
  res.send(result);
  res.end();
});

projectRoute.put("/updateProject", async (req, res) => {
  const result = await updateTask(req.body);
  res.send("Data Updated");
  res.end();
});

projectRoute.delete("/deleteProject/:id", async (req, res) => {
  const result = deleteRecord(req.params.id);
  res.status(200).send(result);
  res.end();
});

const addTask = async (values) => {
  const project = new Project({
    projectName: values.projectName,
    projectCode: values.projectCode,
    discription: values.discription,
    status: values.status,
    assignedTo: values.assignedTo,
    progressTillNow: values.progressTillNow,
  });
  console.log("valesadd", values);
  try {
    const result = await project.save();
    return result;
  } catch (error) {
    console.log("error in add project :", error);
    return { error: error };
  }
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
        discription: values.discription,
        status: values.status,
        assignedTo: values.assignedTo,
        progressTillNow: values.progressTillNow,
        dateUpdate: Date.now,
      },
    },
  );
};

module.exports = projectRoute;
