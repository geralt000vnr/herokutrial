const Roles = require("../models/roles");

module.exports.createRole = async (values) => {
  let roleCound = await Roles.find().count();
  values.id = roleCound + 1;
  let result = await Roles.create(values);
  return result;
};

module.exports.getAllRoleList = async (values, res) => {
  let roleList = await Roles.find({
    $or: [{ roleName: { $regex: values.search, $options: "i" } }],
  })
    .sort({ [values.sortField]: values.order === "asc" ? 1 : -1 })
    .skip((values.pageNo - 1) * values.perPage)
    .limit(values.perPage);
  res
    .status(200)
    .send({ list: roleList, pagination: { totalRow: roleList.length } });
};

module.exports.getRoleDetails = async (id, res) => {
  let roleList = await Roles.findById(id);
  return roleList;
  res.status(200).send(roleList);
};
