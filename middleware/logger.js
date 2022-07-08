const log = (req, res, next) => {
  console.log("log function running...");
  next();
};

module.exports = log;
