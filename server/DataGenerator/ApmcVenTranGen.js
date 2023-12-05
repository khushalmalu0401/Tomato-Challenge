const mongoose = require("mongoose");
const APMC = require("../models/apmcSchema");
const Vendor = require("../models/vendorSchema");
const TomatoRequest = require("../models/TomatoRequest");

mongoose.connect(
  "mongodb+srv://tomatachallenge:admin@tomatachallenge.mdm3cn8.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const getRandomWeight = () => {
  return Math.floor(Math.random() * (500 - 10 + 1)) + 10;
};

const getRandomDate = (startDate, endDate) => {
  const randomDate = new Date(
    startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime())
  );

  return randomDate;
};

const getRandomVendor = async () => {
  try {
    const vendorData = await Vendor.aggregate([
      { $sample: { size: 1 } },
    ]).exec();

    if (vendorData.length === 0) {
      throw new Error("Vendor data not found");
    }

    return vendorData[0];
  } catch (error) {
    console.error("Error:", error);
  }
};

const generateRandomTransactions = async () => {
  try {
    const apmcData = await APMC.find();

    if (apmcData.length === 0) {
      throw new Error("APMC data not found");
    }

    for (const apmc of apmcData) {
      // const numEntries = 2;
      const numEntries = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
      for (let i = 0; i < numEntries; i++) {
        const vendor = await getRandomVendor();
        const weight = getRandomWeight();
        const date = getRandomDate(startDate, endDate);

        const transaction = new TomatoRequest({
          apmcMarket: {
            id: apmc._id,
            name: apmc.name,
            location: apmc.location,
            state: apmc.state,
          },
          vendor: {
            id: vendor._id,
            name: vendor.name,
            phone: vendor.phone,
          },
          weight: weight,
          date: date,
        });

        console.log(`Generated transaction: ${JSON.stringify(transaction)}`);

        await transaction.save();
        console.log(`Saved transaction: ${JSON.stringify(transaction)}`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const createRandomTransactionsForDateRange = async (startDate, endDate) => {
  try {
    while (startDate <= endDate) {
      console.log(
        `Generating transactions for date: ${startDate.toISOString()}`
      );
      await generateRandomTransactions(startDate, startDate);
      startDate.setDate(startDate.getDate() + 1);
    }
    console.log(`Transactions inserted successfully.`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Set your desired start and end dates
const startDate = new Date("2023-12-5");
const endDate = new Date("2023-12-6");

createRandomTransactionsForDateRange(startDate, endDate);
