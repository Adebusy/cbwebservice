const express = require("express");
const router = express.Router();
const {CheckAndCreateNewUser,LogMeIn, UpdatePassword,getUserByEmail} = require("../model/usermodel");
router.post("/SignUp", CheckAndCreateNewUser);
router.post("/LogMeIn", LogMeIn); 
router.get("/passwordRecovery/:email", UpdatePassword);
router.get("/getUserByEmail/:email", getUserByEmail);

module.exports = router;
