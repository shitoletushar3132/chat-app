const UserModel = require("../models/UserModel");

async function searchUser(req, res) {
  try {
    const { search } = req.body;
    const query = new RegExp(search, "i");

    console.log("search", search);

    const users = await UserModel.find({
      $or: [{ name: query }, { email: query }],
    }).select("-password");

    return res.json({
      message: "All users",
      data: users,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "An error occurred",
      error: true,
    });
  }
}

module.exports = searchUser;
