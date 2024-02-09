const mongoose = require("mongoose");
const Team = require("../models/team");
const express = require("express");
const userAuth = require("../middleware/authMiddleware");
const { createTeam, getTeamList } = require("../controllers/teamController");
const router = express.Router();

router.post("/createTeam", userAuth, async (req, res) => {
  const result = createTeam(req.body);
  res.send(result);
});

router.post("/getTeamList", userAuth, async (req, res) => {
  const result = await getTeamList(req.body, res);
  res.send(result);
  res.end();
});

module.exports = router;
