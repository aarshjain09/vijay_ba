const User = require("../models/user");

exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
