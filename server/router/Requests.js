const jwt = require("jsonwebtoken");
const express = require("express");
const requestRouter = express.Router();

const createRequest = require("../controllers/Requests/Apmc/Create");
const getApmcRequests = require("../controllers/Requests/Apmc/GetRequests");
const getReceivedRequests = require("../controllers/Requests/Apmc/getReceivedRequests");
const createVendorRequest = require("../controllers/Requests/Vendor/Create");
const getVendorRequests = require("../controllers/Requests/Vendor/GetRequests");
const cancelRequest = require("../controllers/Requests/Apmc/CancelRequest");
const cancelVendorRequest = require("../controllers/Requests/Apmc/CancelVendorRequest");

// Routes for APMC requesting Tomatoes
requestRouter.post("/apmc", createRequest); // APMC requests tomatoes
requestRouter.get("/apmc", getApmcRequests); // APMC gets all requests
// requestRouter.put("/apmc/:id", modifyRequest); // APMC modifies request
requestRouter.delete("/apmc/:id", cancelRequest); // APMC cancels request

// APMC providing tomatoes
requestRouter.get("/apmc/received-requests", getReceivedRequests); // APMC gets all received requests

// Routes for Vendor requesting tomatoes
requestRouter.post("/vendor", createVendorRequest); // Vendor requests tomatoes
requestRouter.get("/vendor", getVendorRequests); // Vendor gets all requests
requestRouter.delete("/vendor/:id", cancelVendorRequest); // Vendor cancels request
// router.put('/vendor/:id', modifyVendorRequest);    // Vendor modifies request

module.exports = requestRouter;

/* OLD ROUTES

// Apmc Requesting other apmc
// apmcDatarequestRouter.post("/requestTomatoFromOtherApmc", RequestTomatoFromOtherApmc);
// Route for APMC receiving requests from vendors or other APMCs
// apmcDatarequestRouter.get("/getApmcRequestingTomato", GetApmcRequestingTomato);
apmcDataRouter.get("/apmc-requests", GetApmcRequest); // apmc is viewing vendor request  // need to be deleted
apmcDataRouter.post("/requestTomato", RequestTomato); //vendor is requesting tomato
apmcDataRouter.get("/getVendorTomatoRequests", GetVendorRequests); // vendor is viewing its request
statsRouter.get("/getrequestTomatoFromOtherApmcList", GetApmcTomatoRequests);
*/
