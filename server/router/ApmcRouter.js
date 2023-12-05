const jwt = require("jsonwebtoken");
const express = require("express");
const ApmcRouter = express.Router();
const GetApmcDashboard = require("../controllers/APMC/GetDashboard");

ApmcRouter.get("/farmer", GetApmcDashboard);

module.exports = ApmcRouter;
