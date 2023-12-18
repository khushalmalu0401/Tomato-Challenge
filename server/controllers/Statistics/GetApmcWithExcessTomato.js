const TomatoTransaction = require("../../models/TomatoTransactionSchema");
const TomatoRequest = require("../../models/TomatoRequest");
const DistanceMatrix = require("../../models/DistanceMatrix");
const geolib = require("geolib");
const faker = require("faker");

const GetApmcWithExcessTomato = async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const apmcCity = req.params.name;

    const results = [];

    const supply = await TomatoTransaction.aggregate([
      {
        $match: {
          date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Next day
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
          location: "$apmcMarket.location",
        },
      },
    ]).exec();

    const demand = await TomatoRequest.aggregate([
      {
        $match: {
          date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Next day
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

    const apmcData = supply.map((supplyEntry) => ({
      apmc: supplyEntry.apmcMarket,
      stocks: supplyEntry.stocks,
      location: supplyEntry.location,
      demand:
        demand.find(
          (demandEntry) => demandEntry.apmcMarket === supplyEntry.apmcMarket
        )?.demand || 0,
    }));

    const totalStocks = apmcData.reduce((sum, apmc) => sum + apmc.stocks, 0);
    const averageStocks = totalStocks / apmcData.length;

    // console.log(apmcData);

    const positiveApmcs = await Promise.all(
      apmcData
        .filter((apmc) => apmc.stocks - apmc.demand > 0)
        .map(async (apmc) => {
          const excessapmc = apmc.apmc.split("-")[1];

          // console.log(apmcCity, excessapmc);
          if (apmcCity !== excessapmc) {
            const distanceEntry = await DistanceMatrix.findOne({
              $or: [
                { City1: apmcCity, City2: excessapmc },
                { City1: excessapmc, City2: apmcCity },
              ],
            });

            const randomDistance = distanceEntry ? distanceEntry.Distance : 620;
            // console.log(apmcCity, excessapmc, randomDistance);
            return {
              apmc: apmc.apmc,
              stocks: apmc.stocks,
              location: apmc.location,
              demand: apmc.demand,
              distance: randomDistance,
            };
          }

          return null; // Filter out cases where apmcCity and excessapmc are the same
        })
    );

    const filteredPositiveApmcs = positiveApmcs.filter((apmc) => apmc !== null);

    filteredPositiveApmcs.sort((a, b) => a.distance - b.distance);

    res.status(200).json(filteredPositiveApmcs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetApmcWithExcessTomato;
