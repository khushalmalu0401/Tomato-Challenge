const express = require("express");
const router = express.Router();
const TomatoRequest = require("../../../models/TomatoRequest"); // Replace with the actual model import

// APMC Request API Endpoint
const GetApmcRequest = async (req, res) => {
  try {
    // Get the APMC name from the request body
    const apmcName = req.query.apmcName;
    console.log(apmcName);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    console.log("Today:", today.toISOString());
    console.log("Tomorrow:", tomorrow.toISOString());

    // Search for all tomato requests made by vendors for the given APMC
    const requests = await TomatoRequest.find({
      "apmcMarket.name": apmcName,
      date: { $gte: today, $lt: tomorrow },
    });

    // Send the requests data to the frontend
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetApmcRequest;
