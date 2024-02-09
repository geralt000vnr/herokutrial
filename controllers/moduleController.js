const Module = require("../models/modules");

module.exports.createModule = async (values) => {
  let roleCound = await Module.find().count();
  values.id = roleCound + 1;
  let result = await Module.create(values);
  return result;
};

module.exports.getAllModuleList = async (values, res) => {
  let roleList = await Module.find({
    $or: [{ moduleName: { $regex: values.search, $options: "i" } }],
  })
    .sort({ [values.sortField]: values.order === "asc" ? 1 : -1 })
    .skip((values.pageNo - 1) * values.perPage)
    .limit(values.perPage);
  res
    .status(200)
    .send({ list: roleList, pagination: { totalRow: roleList.length } });
};

module.exports.getMyModules = async (values, res) => {
  let roleList = await Module.find({
    $or: [{ moduleName: { $regex: values.search, $options: "i" } }],
  })
    .sort({ [values.sortField]: values.order === "asc" ? 1 : -1 })
    .skip((values.pageNo - 1) * values.perPage)
    .limit(values.perPage);
  res
    .status(200)
    .send({ list: roleList, pagination: { totalRow: roleList.length } });
};
