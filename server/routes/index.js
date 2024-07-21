const express = require("express");
const registerUser = require("../controller/registerUser");
const checkEmail = require("../controller/checkEmail");
const checkPassword = require("../controller/checkPassword");
const userDetail = require("../controller/userDetail");
const logOut = require("../controller/logOut");
const updateUserDetails = require("../controller/updateUserDetails");
const router = express.Router();

//create user APi
router.post("/register", registerUser);
//check user email
router.post("/email", checkEmail);
//check user password
router.post("/password", checkPassword);
//login user details
router.get("/user-details", userDetail);
//logout user
router.get("/logout", logOut);
//update user details
router.post("/update-user", updateUserDetails);

module.exports = router;
