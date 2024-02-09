const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    role: { type: Number, required: true },
    roleName: { type: String, required: true },
    permissions: [{ type: String }],
  },
  {
    timestamps: true,
  },
);

const Roles = mongoose.model("Roles", rolesSchema);
module.exports = Roles;
