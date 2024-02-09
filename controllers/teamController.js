const Team = require("../models/team");

module.exports.createTeam = async (values) => {
  let teamCount = await Team.find().count();
  values.id = teamCount + 1;
  let result = await Team.create(values);
  return result;
};

module.exports.getTeamList = async (values, res) => {
  let teamList = await Team.find({
    $or: [{ teamName: { $regex: values.search, $options: "i" } }],
  })
    .sort({ [values.sortField]: values.order === "asc" ? 1 : -1 })
    .skip((values.pageNo - 1) * values.perPage)
    .limit(values.perPage);
  res
    .status(200)
    .send({ list: teamList, pagination: { totalRow: teamList.length } });
};
