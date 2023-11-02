const jwt = require("jsonwebtoken");
const express = require("express");
const apmcDataRouter = express.Router();
const GetApmcCount = require("../controllers/ApmcData/GetApmcCount");
const RequestTomato = require("../controllers/ApmcData/RequestTomato");
const GetApmcStocks = require("../controllers/ApmcData/GetApmcStocks");
const GetApmcRequest = require("../controllers/ApmcData/GetApmcRequest");
const GetVendorRequests = require("../controllers/ApmcData/GetVendorRequests");
const GetApmcWithExcessTomato = require("../controllers/ApmcData/GetApmcWithExcessTomato");
const RequestTomatoFromOtherApmc = require("../controllers/ApmcData/RequestTomatoFromOtherApmc");
const GetApmcTomatoRequests = require("../controllers/ApmcData/GetApmcTomatoRequests");
const GetApmcRequestingTomato = require("../controllers/ApmcData/GetApmcRequestingTomato");

apmcDataRouter.get("/list", GetApmcCount);
apmcDataRouter.post("/requestTomato", RequestTomato);
apmcDataRouter.get("/getTomatoStocks", GetApmcStocks);
apmcDataRouter.get("/apmc-requests", GetApmcRequest);

apmcDataRouter.get("/getVendorTomatoRequests", GetVendorRequests);
apmcDataRouter.get("/getApmcWithExcessTomato", GetApmcWithExcessTomato);
apmcDataRouter.post("/requestTomatoFromOtherApmc", RequestTomatoFromOtherApmc);
apmcDataRouter.get("/getrequestTomatoFromOtherApmcList", GetApmcTomatoRequests);
apmcDataRouter.get("/getApmcRequestingTomato", GetApmcRequestingTomato);

module.exports = apmcDataRouter;
