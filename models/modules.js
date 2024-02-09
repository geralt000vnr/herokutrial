const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    moduleName: { type: String, required: true },
    c: { type: Boolean, required: true, default: false },
    r: { type: Boolean, required: true, default: false },
    u: { type: Boolean, required: true, default: false },
    d: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

const Module = mongoose.model("Module", moduleSchema);
module.exports = Module;
