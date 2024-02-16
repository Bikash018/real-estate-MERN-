const mongoose = require("mongoose");
const express = require("express");
const { test } = require("../controllers/user.contoller");

const router =  express.Router();

router.get("/test" , test)

module.exports = router


