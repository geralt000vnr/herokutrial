const express = require("express");
const userAuth = require("../middleware/authMiddleware");
const {
  createRole,
  getAllRoleList,
  getRoleDetails,
} = require("../controllers/permission");
const router = express.Router();

// router.post("/createRole", userAuth, async (req, res) => {
//   const result = createRole(req.body);
//   res.send(result);
// });

router.post("/getAllRoleList", userAuth, async (req, res) => {
  const result = await getAllRoleList(req.body, res);
  res.send(result);
  res.end();
});

router.get("/getRoleDetails/:id", userAuth, async (req, res) => {
  console.log("askdjfk", req.params.id);
  const result = await getRoleDetails(req.params.id, res);
  res.send(result);
  res.end();
});

module.exports = router;
