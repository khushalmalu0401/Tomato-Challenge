const TomatoTransaction = require("../../models/TomatoTransactionSchema");
const TomatoRequest = require("../../models/TomatoRequest"); // Import your TomatoRequest model

const GetApmcSupplyDemandByMonth = async (req, res) => {
  try {
    const year = 2023; // Set the year you want to filter
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const results = [];

    for (let month = 0; month < 12; month++) {
      const supply = await TomatoTransaction.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(year, month, 1),
              $lte: new Date(year, month + 1, 0),
            },
          },
        },
        {
          $group: {
            _id: "$apmcMarket.name",
            totalWeight: { $sum: "$weight" },
          },
        },
        {
          $project: {
            _id: 0,
            apmcMarket: "$_id",
            stocks: "$totalWeight",
          },
        },
      ]).exec();

      const demand = await TomatoRequest.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(year, month, 1),
              $lte: new Date(year, month + 1, 0),
            },
          },
        },
        {
          $group: {
            _id: "$apmcMarket.name",
            totalRequest: { $sum: "$weight" },
          },
        },
        {
          $project: {
            _id: 0,
            apmcMarket: "$_id",
            demand: "$totalRequest",
          },
        },
      ]).exec();

      // console.log(demand);

      results.push({
        month: months[month],
        data: supply.map((supplyEntry) => ({
          apmc: supplyEntry.apmcMarket,
          stocks: supplyEntry.stocks,
          demand:
            demand.find(
              (demandEntry) => demandEntry.apmcMarket === supplyEntry.apmcMarket
            )?.demand || 0,
        })),
      });
    }
    // Sort results based on the difference between stocks and demand in ascending order
    results.forEach((result) => {
      result.data.sort((a, b) => a.stocks - a.demand - (b.stocks - b.demand));
    });

    // Get the top 10 results for each month
    results.forEach((result) => {
      result.data = result.data.slice(0, 5);
    });

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetApmcSupplyDemandByMonth;
