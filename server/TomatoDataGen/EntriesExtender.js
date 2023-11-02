const mongoose = require("mongoose");
const TomatoTransaction = require("../models/TomatoTransactionSchema");
// const TomatoTransaction = require("../m");
const APMC = require("../models/ApmcSchema");
const Farmer = require("../models/userSchema");

mongoose.connect("mongodb+srv://riteshlade10:VXsKtWnrDkQhlEqm@tomatochallenge1.mrvavwx.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
});

// Function to generate a random transaction
const generateRandomTransaction = async (date) => {
  const randomAPMC = await APMC.aggregate([{ $sample: { size: 1 } }])
    .option({ maxTimeMS: 30000 })
    .exec();
  const randomFarmer = await Farmer.aggregate([{ $sample: { size: 1 } }])
    .option({ maxTimeMS: 30000 })
    .exec();

  if (randomAPMC.length === 0 || randomFarmer.length === 0) {
    throw new Error("APMC or Farmer data not found");
  }

  const apmc = randomAPMC[0];
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

// Function to create and save random transactions for a week
const createRandomTransactionsForWeek = async () => {
  try {
    const startDate = new Date("2023-10-10");
    const endDate = new Date("2023-10-17");
    const transactions = [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      for (let i = 0; i < 100; i++) {
        transactions.push(await generateRandomTransaction(new Date(date)));
      }
    }

    await TomatoTransaction.insertMany(transactions);
    console.log("Random transactions for a week inserted successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

createRandomTransactionsForWeek();
