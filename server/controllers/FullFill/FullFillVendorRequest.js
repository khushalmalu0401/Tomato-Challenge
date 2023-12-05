const TomatoRequest = require("../../models/TomatoRequest");
const APMC = require("../../models/ApmcSchema");
const TomatoStocksInApmc = require("../../models/TomatoStocksInApmc");

const FullFillRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    // Find the tomato request by ID
    const tomatoRequest = await TomatoRequest.findById(requestId);

    if (!tomatoRequest) {
      return res.status(404).json({ error: "Tomato request not found" });
    }

    // Update the tomato request status to fulfill
    tomatoRequest.fullfill = true;

    // Subtract the weight from daily stocks
    const apmcId = tomatoRequest.apmcMarket.id;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);
    const weight = tomatoRequest.weight;

    // Find the APMC by ID
    const apmc = await APMC.findById(apmcId);

    if (!apmc) {
      return res.status(404).json({ error: "APMC not found" });
    }

    // Find the daily stock for the given date
    const dailyStock = await TomatoStocksInApmc.findOne({
      date: { $gte: today, $lt: tomorrow },
      id: apmcId,
    });

    console.log(dailyStock);

    if (dailyStock) {
      // Subtract the weight from totalStocks
      dailyStock.totalStocks -= weight;
      await tomatoRequest.save();
      await dailyStock.save();

      res.status(200).json({
        message: "Tomato request fulfilled successfully",
        updatedStock: dailyStock.totalStocks,
      });
    } else {
      return res.status(404).json({
        error: `Daily stocks not found for APMC ${apmcId} on date ${
          date.toISOString().split("T")[0]
        }`,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = FullFillRequest;
