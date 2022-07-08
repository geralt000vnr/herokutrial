const Express = require("express");
const commonCompRoute = Express.Router();
const mongoose = require("mongoose");

const commonComponentSchema = new mongoose.Schema({
  label: String,
  value: String,
});

const CommonComponents = mongoose.model(
  "CommonComponents",
  commonComponentSchema,
);

commonCompRoute.get("/getCommonComponent", async (req, res) => {
  const result = await CommonComponents.find();
  res.status(200).send(result);
  res.end();
});

module.exports = commonCompRoute;
