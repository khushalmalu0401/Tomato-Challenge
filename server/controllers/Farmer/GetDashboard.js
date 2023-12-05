const TomatoData = require("../../models/TomatoTransactionSchema");
const TomatoRequest = require("../../models/TomatoRequest");
const RequestTomatoFromOtherApmc = require("../../models/RequestTomatoFromOtherApmc");
const TomatoStocksInApmc = require("../../models/TomatoStocksInApmc");
const Apmc = require("../../models/ApmcSchema");

const GetData = async (req, res) => {
  try {
    const { farmerPhone } = req.params;
    console.log(farmerPhone);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    if (!farmerPhone) {
      return res.status(400).json({ error: "Option is required." });
    }

    // Query your MongoDB collection for data based on the selected option

    const tomatoData = await TomatoData.find({
      "farmer.phone": farmerPhone,
      // date: today.toISOString(),
    });
    const totalCount = tomatoData.length;

    const totalProfit = await TomatoData.aggregate([
      {
        $match: {
          "farmer.phone": Number(farmerPhone),
          // Add any other matching criteria as needed
        },
      },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: "$price" },
        },
      },
    ]);
    console.log(totalProfit);
    const totalProfitValue =
      totalProfit.length > 0 ? totalProfit[0].totalProfit : 0;

    const totalApmcCount = await Apmc.countDocuments();

    const highestPrice = await Apmc.find({})
      .sort({ currentPrice: -1 })
      .limit(5);
    // const temp = highestPrice[1];

    const highestPriceApmc = highestPrice[1] ? highestPrice[1] : 0;
    // console.log(temp);
    res.status(200).json({
      totalCount,
      totalProfitValue,
      highestPriceApmc,
      totalApmcCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetData;
