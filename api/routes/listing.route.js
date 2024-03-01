const express = require("express");
const { verifyUser } = require("../utils/verifyUser");
const { createListing } = require("../controllers/listing.controller");

const router = express.Router();

router.post("/create" ,verifyUser, createListing)

module.exports = router