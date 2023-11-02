const express = require("express");
const router = express.Router();
const TomatoRequestedfromOtherApmc = require("../../models/RequestTomatoFromOtherApmc");

// APMC Request API Endpoint
const GetApmcTomatoRequests = async (req, res) => {
  try {
    // Get the vendor name and id from the request body
    const { apmcName } = req.query;

    // Search for all tomato requests made by the specified vendor
    const requests = await TomatoRequestedfromOtherApmc.find({
      "apmcMarketRequesting.name": apmcName,
    });

    // Send the requests data to the frontend``12321`a
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetApmcTomatoRequests;
