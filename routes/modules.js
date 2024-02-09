const express = require("express");
const userAuth = require("../middleware/authMiddleware");
const {
  createModule,
  getAllModuleList,
  getMyModules,
} = require("../controllers/moduleController");
const router = express.Router();

router.post("/createModule", userAuth, async (req, res) => {
  const result = createModule(req.body);
  res.send(result);
});

router.post("/getAllModuleList", userAuth, async (req, res) => {
  const result = await getAllModuleList(req.body, res);
  res.send(result);
  res.end();
});

router.post("/getMyModules", userAuth, async (req, res) => {
  const result = await getMyModules(req.body, res);
  res.send(result);
  res.end();
});

module.exports = router;
