const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");
const task = require("./tasks");
const commonComponent = require("./CommonComp");
const user = require("./routes/User");
const auth = require("./routes/auth");
mongoose
  .connect("mongodb://localhost/hrmstrail")
  .then((res) => console.log("connected :)"))
  .catch((err) => console.log("err :", err));

const app = express();

app.use(express.json());
// app.use(express.urlencoded());
app.use(logger);
app.use(cors());
app.use("/api/task", task);
app.use("/api/common", commonComponent);
app.use("/api/user", user);
app.use("/api/login", auth);

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`on ${port}...`));
