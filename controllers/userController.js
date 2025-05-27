const util = require("util");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const APIError = require("./../utils/APIError");

const jwtSign = util.promisify(jwt.sign);

const signup = async (req, res) => {
  const data = req.body;

  if (data.password !== data.passwordConfirm) {
    throw new APIError("Password and Password Confirm must be the same", 400);
  }


  const saltRounds = parseInt(process.env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  

  const user = await User.create({
    ...data,
    role: "user",
    password: hashedPassword,
  });

 
  res.status(201).json({
    message: "User has been registered successfully",
    data: {
      user,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  
  const user = await User.findOne({ email });

  if (!user) {
    throw new APIError("Invalid email or password", 400);
  }

  
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new APIError("Invalid email or password", 400);
  }

  const secretKey = process.env.JWT_SECRET;
  const token = await jwtSign({ id: user._id }, secretKey, { expiresIn: "1d" });

  
  res.status(200).json({
    message: "User has been logged in successfully",
    data: {
      token,
    },
  });
};

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    message: "Users fetched successfully",
    data: {
      total: users.length,
      users,
    },
  });
  
};

const getOneUser = async (req, res) => {
  const { id } = req.params;
 
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new APIError("User not found", 404);
  }
  
  
  res.status(200).json({
    message: "User fetched successfully",
    data: {
      user,
    },
  });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  
  const payload = req.body;
  delete payload.role;
  

  const user = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  if (!user) {
    throw new APIError("User not found", 404);
  }

  res.status(200).json({
    message: "User updated successfully",
    data: {
      user,
    },
  });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    throw new APIError("User not found", 404);
  }
  
  res.status(204).json({
    message: "User deleted successfully",
  });
};

module.exports = {
  signup,
  login,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
};
