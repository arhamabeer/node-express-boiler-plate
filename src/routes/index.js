const express = require("express");
const userRoute = require("./userRoutes");
const urlRoute = require("./urlRoutes");
const router = express.Router();

router.use("/users", userRoute);
router.use("/url", urlRoute);

module.exports = router;
