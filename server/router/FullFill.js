const jwt = require("jsonwebtoken");
const express = require("express");
const FullFillRouter = express.Router();
const FullFillVendorRequest = require("../controllers/FullFill/FullFillVendorRequest");
const FullFillApmcRequest = require("../controllers/FullFill/FullFillApmcRequest.js")

// // Routes for APMC providing tomatoes to apmc
// FullFillRouter.post("/apmc/fulfill/:id", fulfillRequest); // APMC fulfills a request from APMC
// router.delete('/apmc/fulfill/:id', cancelFulfillment);// APMC cancels fulfillment for APMC
// router.get('/apmc/fulfillments', getFulfillments);   // APMC gets all fulfillments for APMC

// // Routes for APMC providing tomatoes to Vendor
FullFillRouter.post("/vendor/:id", FullFillVendorRequest); // APMC fulfills a request from Vendor
// router.delete('/vendor/fulfill/:id', cancelVendorFulfillment);// APMC cancels fulfillment for Vendor
// router.get('/vendor/fulfillments', getVendorFulfillments);   // APMC gets all fulfillments for Vendor

FullFillRouter.post("/apmc/:id", FullFillApmcRequest); // APMC fulfills a request from Vendor

module.exports = FullFillRouter;
