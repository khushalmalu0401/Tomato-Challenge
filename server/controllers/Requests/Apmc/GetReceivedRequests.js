const express = require("express");
const router = express.Router();
const TomatoRequest = require("../../../models/TomatoRequest");
const TomatoRequestedfromOtherApmc = require("../../../models/RequestTomatoFromOtherApmc");

// APMC Request API Endpoint
const GetReceivedRequests = async (req, res) => {
  try {
    const { apmcName } = req.query;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    const apmcsRequesting = await TomatoRequestedfromOtherApmc.find({
      "apmcProviding.name": apmcName,
      date: { $gte: today, $lt: tomorrow },
    });

    const vendorsRequesting = await TomatoRequest.find({
      "apmcMarket.name": apmcName,
      date: { $gte: today, $lt: tomorrow },
    });

    // Send the requests data to the frontend
    res.status(200).json({ apmcsRequesting, vendorsRequesting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetReceivedRequests;
