const express = require("express");

const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const z = require("zod");
const cors = require('cors'); 
app.use(cors());

const mainRouter = require("./routes/user");
app.use("/user",mainRouter);
app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
