const mongoose = require("mongoose");
const APMC = require("./models/apmcSchema"); // Replace with your actual APMC schema and model
const Vendor = require("./models/vendorSchema"); // Replace with your actual Vendor schema and model
const TomatoRequest = require("./models/TomatoRequest"); // Replace with your actual Tomato Request schema and model

mongoose.connect(
  "mongodb+srv://riteshlade10:VXsKtWnrDkQhlEqm@tomatochallenge1.mrvavwx.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const getRandomWeight = () => {
  return Math.floor(Math.random() * (500 - 10 + 1)) + 10;
};

const getRandomDate = () => {
  const startDate = new Date(2020, 0, 1); // Start date: January 1, 2023
  const endDate = new Date(2023, 9, 31); // End date: December 31, 2023

  const randomDate = new Date(
    startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime())
  );

  return randomDate;
};

const generateRandomTransaction = async () => {
  try {
    const apmcData = await APMC.aggregate([{ $sample: { size: 1 } }]).exec();
    const vendorData = await Vendor.aggregate([
      { $sample: { size: 1 } },
    ]).exec();

    if (apmcData.length === 0 || vendorData.length === 0) {
      throw new Error("APMC or Vendor data not found");
    }

    const apmc = apmcData[0];
    const vendor = vendorData[0];

    const weight = getRandomWeight();
    const date = getRandomDate();

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

    await transaction.save();
  } catch (error) {
    console.error("Error:", error);
  }
};

const createRandomTransactions = async (count) => {
  try {
    for (let i = 0; i < count; i++) {
      await generateRandomTransaction();
    }
    console.log(`${count} random transactions inserted successfully.`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

createRandomTransactions(1000); // You can specify the number of transactions you want to create
