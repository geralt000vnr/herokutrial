// const Express = require("express");
// const holidayRouter = Express.Router();
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    teamName: { type: String, required: true },
    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    assignedMembers: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    seniorMember: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    assignedProjects: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    teamGroupChatId: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  },
);

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
