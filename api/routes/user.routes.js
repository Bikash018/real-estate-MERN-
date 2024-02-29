const mongoose = require("mongoose");
const express = require("express");
const { test, updateUser, deleteUser } = require("../controllers/user.contoller.js");
const {verifyUser} = require("../utils/verifyUser.js")

const router =  express.Router();

router.get("/test" , test)
router.post("/update/:id" ,verifyUser,updateUser)
router.delete("/delete/:id" ,verifyUser,deleteUser);

module.exports = router


