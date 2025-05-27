const APIError = require("./../utils/APIError");
const jwt = require("jsonwebtoken");
const util = require("util");
const User = require("./../models/userModel");

const jwtVerify = util.promisify(jwt.verify);

const auth = async (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    throw new APIError("Unauthorized", 401);
  }
  const token = bearerToken.split(" ")[1];

  const secretKey = process.env.JWT_SECRET;
  const decodedData = await jwtVerify(token, secretKey);

  const user = await User.findOne({ _id: decodedData.id }).select(
    "name email role"
  );
  

  if (!user) {
    throw new APIError("Unauthorized", 401);
  }

  req.user = user;
  next();
};

module.exports = auth;
