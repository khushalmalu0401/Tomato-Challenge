const TomatoTransaction = require("../../models/TomatoTransactionSchema");
const TomatoRequest = require("../../models/TomatoRequest");
const geolib = require("geolib"); // Import a library for distance calculations
const faker = require("faker"); // Import a library for generating random data

const GetApmcWithExcessTomato = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth(); // Get the current month (0-11)
    const year = new Date().getFullYear(); // Get the current year

    const results = [];

    // Retrieve supply and demand data for the current month
    const supply = await TomatoTransaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(year, currentMonth, 1),
            $lte: new Date(year, currentMonth + 1, 0),
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
            $gte: new Date(year, currentMonth, 1),
            $lte: new Date(year, currentMonth + 1, 0),
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

    // Calculate the supply-demand difference, filter positive values, and sort in descending order
    const positiveApmcs = apmcData
      .filter((apmc) => apmc.stocks - apmc.demand > 0)
      .map((apmc) => {
        // Generate a random distance for each APMC (for demonstration purposes)
        const randomDistance = faker.datatype.number({ min: 1, max: 100 }); // Modify min and max as needed
        return {
          ...apmc,
          distance: randomDistance, // Add random distance to the APMC data
        };
      });

    // Sort the APMCs based on the random distance
    positiveApmcs.sort((a, b) => a.distance - b.distance);

    res.status(200).json(positiveApmcs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetApmcWithExcessTomato;
