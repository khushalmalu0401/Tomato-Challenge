const express = require("express");
const router = express.Router();
const TomatoRequest = require("../../../models/TomatoRequest");
const APMC = require("../../../models/ApmcSchema"); // Import the APMC schema

// APMC Request API Endpoint
const GetVendorRequests = async (req, res) => {
  try {
    // Get the vendor name and id from the request body
    const vendorName = req.query.vendorName;
    const vendorId = req.query.vendorId;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    // Search for all tomato requests made by the specified vendor
    const requests = await TomatoRequest.find({
      "vendor.name": vendorName,
      "vendor.id": vendorId,
      date: { $gte: today, $lt: tomorrow },
    });

    // Fetch the current price for each APMC associated with the requests
    const requestsWithPrices = await Promise.all(
      requests.map(async (request) => {
        const apmcId = request.apmcMarket.id;
        const apmc = await APMC.findById(apmcId);

        if (apmc) {
          return {
            ...request._doc,
            price: apmc.currentPrice,
          };
        } else {
          // Handle the case where APMC is not found
          return {
            ...request._doc,
            price: null,
          };
        }
      })
    );

    // Send the requests data with prices to the frontend
    res.status(200).json(requestsWithPrices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetVendorRequests;
