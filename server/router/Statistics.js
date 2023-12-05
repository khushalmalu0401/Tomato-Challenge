const jwt = require("jsonwebtoken");
const express = require("express");
const statsRouter = express.Router();

const GetApmcStocks = require("../controllers/Statistics/GetApmcStocks");
const GetApmcCount = require("../controllers/Statistics/GetApmcCount");
const GetApmcWithExcessTomato = require("../controllers/Statistics/GetApmcWithExcessTomato");
const GetApmcTomatoRequests = require("../controllers/Requests/Apmc/GetRequests");
// Stats
statsRouter.get("/list", GetApmcCount);
statsRouter.get("/getTomatoStocks", GetApmcStocks);

statsRouter.get("/admin/dashboard", GetApmcStocks);
statsRouter.get("/apmc/excess/:name", GetApmcWithExcessTomato);

module.exports = statsRouter;
