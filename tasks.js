const Express = require("express");
const taskRoute = Express.Router();
const mongoose = require("mongoose");
const userAuth = require("./middleware/authMiddleware");

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  project: mongoose.Schema.Types.ObjectId,
  teamName: String,
  status: String,
  assignedBy: mongoose.Schema.Types.ObjectId,
  assignedTo: mongoose.Schema.Types.ObjectId,
  progressTillNow: Number,
  dateCreated: { type: Date, default: Date.now },
  dateUpdate: { type: Date, default: Date.now },
});

const Task = mongoose.model("Tasks", taskSchema);

taskRoute.get("/getAllTaskList", async (req, res) => {
  const result = await Task.find();
  res.status(200).send(result);
  res.end();
});

taskRoute.post("/getTaskList", userAuth, async (req, res) => {
  let { search, sortField, order, pageNo, perPage, userId } = req.body;
  const result = await Task.find({
    assignedTo: userId,
    $or: [{ taskName: { $regex: search, $options: "i" } }],
  })
    .sort({ [sortField]: order === "asc" ? 1 : -1 })
    .skip((pageNo - 1) * perPage)
    .limit(perPage);
  res
    .status(200)
    .send({ list: result, pagination: { totalRow: result.length } });
  res.end();
});

taskRoute.post("/getProjectTaskList", userAuth, async (req, res) => {
  let { search, sortField, order, pageNo, perPage, projectId } = req.body;
  const result = await Task.find({
    $or: [{ taskName: { $regex: search, $options: "i" } }],
    project: projectId,
  })
    .sort({ [sortField]: order === "asc" ? 1 : -1 })
    .skip((pageNo - 1) * perPage)
    .limit(perPage);
  res
    .status(200)
    .send({ list: result, pagination: { totalRow: result.length } });
  res.end();
});

taskRoute.get("/getTaskDetails/:id", async (req, res) => {
  const result = await Task.find({ _id: req.params.id });
  res.status(200).send(...result);
  res.end();
});

taskRoute.post("/addTask", async (req, res) => {
  const result = await addTask(req.body);
  console.log("reqqq", req.params);
  res.send(result);
  res.end();
});

taskRoute.put("/UpdateTask", async (req, res) => {
  try {
    const result = await updateTask(req.body);
    res.send("Task Updated");
    res.end();
  } catch (error) {
    const result = await updateTask(req.body);
    res.send(error);
    res.end();
  }
});

taskRoute.delete("/deleteTask/:id", async (req, res) => {
  const result = deleteRecord(req.params.id);
  res.status(200).send(result);
  res.end();
});

const addTask = async (values) => {
  const task = new Task({
    taskName: values.taskName,
    projectName: values.projectName,
    teamName: values.teamName,
    status: values.status,
    assignedBy: values.assignedBy,
    assignedTo: values.assignedTo,
    progressTillNow: values.progressTillNow,
  });
  console.log("valesadd", values);
  try {
    const result = await task.save();
    return result;
  } catch (error) {
    console.log("error in add Task :", error);
    return { error: error };
  }
};

const deleteRecord = async (id) => {
  const result = await Task.deleteOne({ _id: id });
  return result;
};

const updateTask = async (values) => {
  const result = await Task.updateOne(
    { _id: values.id },
    {
      $set: {
        taskName: values.taskName,
        projectName: values.projectName,
        teamName: values.teamName,
        status: values.status,
        assignedBy: values.assignedBy,
        assignedTo: values.assignedTo,
        progressTillNow: values.progressTillNow,
        // dateUpdate: Date.now,
      },
    },
  );
  return result;
};

module.exports = taskRoute;
