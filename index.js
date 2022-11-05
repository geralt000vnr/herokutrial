const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");
const task = require("./tasks");
const commonComponent = require("./CommonComp");
const user = require("./routes/User");
const auth = require("./routes/auth");
const projectRoute = require("./models/Projects");
const expressFileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const holidayRouter = require("./models/holiday");
const { chat } = require("./models/chat");
const http = require("http");
const { Server } = require("socket.io");

mongoose
  .connect("mongodb://localhost/hrmstrail")
  .then((res) => console.log("connected :)"))
  .catch((err) => console.log("err :", err));

const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//   expressFileUpload({
//     useTempFiles: true,
//     tempFileDir: "public/",
//   }),
// );
// app.use(express.urlencoded());
app.use("/uploads", express.static("uploads"));
app.use(logger);
app.use(cors());
app.use("/api/task", task);
app.use("/api/project", projectRoute);
app.use("/api/common", commonComponent);
app.use("/api/user", user);
app.use("/api/login", auth);
app.use("/api/holiday", holidayRouter);
app.use("/api/chat", chat);

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`on ${port}...`));

// // io.on("connection", (socket) => {
// //   console.log("a user connected");
// //   socket.on("typing", (msg) => {
// //     console.log("typing msg", msg);
// //     io.emit("typing", msg);
// //   });
// //   socket.on("stopTyping", (msg) => {
// //     io.emit("stopTyping", msg);
// //   });
// //   socket.on("chat message", (msg) => {
// //     console.log("message: ", msg);
// //     io.emit("typing", {
// //       msg: "some value",
// //       id: "5",
// //     });
// //     io.emit("chat message", msg);
// //   });
// //   socket.on("disconnect", () => {
// //     console.log("user disconnected");
// //   });
// // });

// // server.listen(4000, () => {
// //   console.log("listening on *:3001");
// // });

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`User Connected ${socket.id}`);
//   socket.on("send_message", (data) => {
//     console.log("message0", data);
//     socket.broadcast.emit("receive_message", data);
//   });
// });
// server.listen(4000, () => {
//   console.log("Server is running on 3001");
// });
