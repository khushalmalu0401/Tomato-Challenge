const mongoose = require("mongoose");
const TomatoTransaction = require("../../models/TomatoTransactionSchema");
const APMC = require("../../models/ApmcSchema");
const Farmer = require("../../models/FarmerSchema");

mongoose.connect(
  "mongodb+srv://tomatachallenge:admin@tomatachallenge.mdm3cn8.mongodb.net/",
  {
    useNewUrlParser: true,
  }
);

// Function to generate a random transaction
const generateRandomTransaction = async (date, apmc) => {
  const randomFarmer = await Farmer.aggregate([{ $sample: { size: 1 } }])
    .option({ maxTimeMS: 30000 })
    .exec();

  if (randomFarmer.length === 0) {
    throw new Error("Farmer data not found");
  }

  const farmer = randomFarmer[0];

  const weight = Math.random() * (700 - 10) + 10;
  let price = Math.random() * (4500 - 1000) + 1000;

  const month = date.getMonth();
  if (month >= 5 && month <= 8) {
    price += 20;
  }

  return new TomatoTransaction({
    apmcMarket: {
      id: apmc._id,
      name: apmc.name,
      location: apmc.location,
      state: apmc.state,
    },
    farmer: {
      id: farmer._id,
      name: farmer.name,
      phone: farmer.phone,
    },
    weight: weight,
    price: price,
    date: date,
  });
};

// Function to create and save random transactions for a range of dates
const createRandomTransactionsForDateRange = async (startDate, endDate) => {
  try {
    const apmcs = await APMC.find(); // Get all APMC markets
    // console.log("APMCs:", apmcs);

    const transactions = [];

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      for (const apmc of apmcs) {
        const numTransactions = Math.floor(Math.random() * (7 - 3 + 1)) + 3;
        // const numTransactions = 2;

        // console.log(
          `Date: ${date.toISOString()}, APMC: ${
            apmc.name
          }, Num Transactions: ${numTransactions}`
        );

        for (let i = 0; i < numTransactions; i++) {
          transactions.push(
            await generateRandomTransaction(new Date(date), apmc)
          );
        }
      }
    }

    await TomatoTransaction.insertMany(transactions);
    // // console.log(
    //   "Random transactions for the date range inserted successfully."
    // );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Set your desired start and end dates
const startDate = new Date("2023-12-5");
const endDate = new Date("2023-12-20");

createRandomTransactionsForDateRange(startDate, endDate);
