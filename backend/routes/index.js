const express = require("express");
const router = express.Router();
const userRouter = require("./user");  // Make sure the path is correct here
const accountRouter = require("./account")
router.use("/user", userRouter);  // This should correctly route POST to /user/register
router.use("/account",accountRouter);
module.exports = router;
