const express = require("express");
const router = express.Router();
const TomatoRequest = require("../../models/TomatoRequest"); // Replace with the actual model import

// APMC Request API Endpoint
const GetVendorRequests = async (req, res) => {
  try {
    // Get the vendor name and id from the request body
    const vendorName = req.query.vendorName;
    const vendorId = req.query.vendorId;

    // Search for all tomato requests made by the specified vendor
    const requests = await TomatoRequest.find({
      "vendor.name": vendorName,
      "vendor.id": vendorId,
    });

    // Send the requests data to the frontend``12321`a
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetVendorRequests;
