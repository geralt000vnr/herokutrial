const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { User } = require("./user");

const messageSchema = new mongoose.Schema({
  msgValue: { type: String, required: true },
  senderId: { type: String, required: true },
  recieverId: { type: String, required: true },
  chatId: { type: String, required: true },
  sendTime: { type: Date, default: Date.now },
});
const chatIdsSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  recieverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdDate: { type: Date, default: Date.now },
});

const Messages = mongoose.model("Messages", messageSchema);
const ChatIds = mongoose.model("ChatIds", chatIdsSchema);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get("/", async (req, res) => {
  const result = await Messages.find();
  res.status(200).send(result);
  res.end();
});

app.get("/getMessage/:chatId", async (req, res) => {
  const result = await Messages.find({ chatId: req.params.chatId });
  console.log("rsule", result, req.params.chatId);
  res.status(200).send(result);
  res.end();
});

app.get("/searchUser/:value", async (req, res) => {
  const result = await User.find({
    fullName: { $regex: req.params.value, $options: "i" },
  });
  // const result = await User.find({ firstName: req.params.value });
  res.status(200).send(result);
  res.end();
});

app.get("/getChatsList/:id", async (req, res) => {
  const result = await ChatIds.find().populate(
    "senderId recieverId",
    "-password",
  );
  res.send(result);

  // ChatIds.aggregate([
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "recieverId",
  //       foreignField: "firstName",
  //       as: "reciever",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "senderId",
  //       foreignField: "firstName",
  //       as: "sender",
  //     },
  //   },
  //   {
  //     $match: {
  //       $or: [{ senderId: req.params.id }, { recieverId: req.params.id }],
  //     },
  //   },
  // ]).exec(function (err, resp) {
  //   if (err) {
  //     console.log("error in join", err);
  //   }
  //   res.status(200).send(resp);
  //   res.end();
  // });
});

io.on("connect", (socket) => {
  console.log(`a user connected ${socket.id}`);
  socket.on("joinRoom", (id) => {
    socket.join(id);
  });
  socket.on("chat message send", async (msg) => {
    let findedId = await ChatIds.findOne({ chatId: msg.chatId });
    if (!findedId) {
      const chatId = new ChatIds({
        chatId: msg.chatId,
        senderId: msg.senderId,
        recieverId: msg.recieverId,
      });
      try {
        const result = await chatId.save();
        return result;
      } catch (error) {
        console.log("error in add chat id :", error);
        return { error: error };
      }
    } else {
      socket.join(msg.chatId);
    }
    const message = new Messages({ ...msg });
    socket.to(msg.chatId).emit("chat message recieve", message);
    console.log("valesadd", message);
    try {
      const result = await message.save();
      return result;
    } catch (error) {
      console.log("error in add message :", error);
      return { error: error };
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});

module.exports.chat = app;
