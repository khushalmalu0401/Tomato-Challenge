const mongoose = require("mongoose");
const TomatoTransaction = require("../models/TomatoTransactionSchema");
const APMC = require("../models/ApmcSchema");
const TomatoStocksInApmc = require("../models/TomatoStocksInApmc");

// Connect to your MongoDB database
mongoose.connect(
  "mongodb+srv://tomatachallenge:admin@tomatachallenge.mdm3cn8.mongodb.net/",
  {
    useNewUrlParser: true,
  }
);

// Function to aggregate and update data in TomatoStocksInApmc collection
const updateTomatoStocks = async () => {
  try {
    console.log("Updating TomatoStocksInApmc collection...");

    const startDate = new Date("2023-12-5");
    const endDate = new Date("2023-12-6");

    // Get all distinct dates within the specified range
    const distinctDates = await TomatoTransaction.distinct("date", {
      date: { $gte: startDate, $lte: endDate },
    });

    console.log("Distinct Dates within the date range:", distinctDates);

    // Iterate over each date
    for (const currentDate of distinctDates) {
      // Get all distinct APMC ids for the current date
      const distinctApmcIds = await TomatoTransaction.distinct(
        "apmcMarket.id",
        {
          date: currentDate,
        }
      );

      console.log(
        `Distinct APMC IDs for date ${currentDate}:`,
        distinctApmcIds
      );

      // Iterate over each APMC id for the current date
      for (const apmcId of distinctApmcIds) {
        // Aggregate total weight for the specific date and APMC
        const aggregateResult = await TomatoTransaction.aggregate([
          {
            $match: {
              date: currentDate,
              "apmcMarket.id": apmcId,
            },
          },
          {
            $group: {
              _id: null,
              totalWeight: { $sum: "$weight" },
            },
          },
        ]);

        // Check if any data is aggregated
        if (aggregateResult.length > 0) {
          const totalWeight = aggregateResult[0].totalWeight;

          // Get the price from the APMC schema
          const apmcData = await APMC.findById(apmcId);
          const price = apmcData.currentPrice; // Update with your actual field for price

          // Update or insert data into TomatoStocksInApmc collection
          await TomatoStocksInApmc.updateOne(
            { date: currentDate, id: apmcId },
            {
              $set: {
                date: currentDate,
                id: apmcId,
                name: apmcData.name,
                price: price,
              },
              $inc: {
                totalStocks: totalWeight,
              },
            },
            { upsert: true }
          );

          console.log(
            `Data updated for APMC ID ${apmcId} on date ${currentDate}. Total Weight: ${totalWeight}, Price: ${price}`
          );
        }
      }
    }

    console.log("Data update completed successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

// Call the function to update TomatoStocksInApmc collection
updateTomatoStocks();
