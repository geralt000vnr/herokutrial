const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    let bearerToken = req.header("Authorization");
    if (!bearerToken) {
      res.status(401);
      res.send("User not Authorized");
      return;
    }

    const user = await jwt.verify(bearerToken, "jwtprivatekey");
    req.body.userId = user._id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userAuth;
