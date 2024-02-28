const mongoose = require("mongoose");
const express = require("express");
const { test, updateUser } = require("../controllers/user.contoller.js");
const {verifyUser} = require("../utils/verifyUser.js")

const router =  express.Router();

router.get("/test" , test)
router.post("/update/:id" ,verifyUser,updateUser)

module.exports = router


