const mongoose = require("mongoose");
const TomatoTransaction = require("../../models/TomatoTransactionSchema"); // Import your TomatoTransaction model
// Define your Mongoose models for APMC and Farmer
const APMC = require("../../models/ApmcSchema"); // Replace with your actual APMC model name
const Farmer = require("../../models/userSchema"); // Replace with your actual Farmer model name

// Connect to your MongoDB database
mongoose.connect(
  "mongodb+srv://riteshlade10:VXsKtWnrDkQhlEqm@tomatochallenge1.mrvavwx.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

// Function to generate random transactions
const generateRandomTransaction = async () => {
  try {
    // Fetch random APMC and Farmer documents from MongoDB with an increased timeout
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

    // Generate random date between Jan 2020 and Oct 2023
    const date = new Date(
      2020 + Math.floor(Math.random() * 4), // Random year between 2020 and 2023
      Math.floor(Math.random() * 12), // Random month between 0 (Jan) and 11 (Dec)
      1 + Math.floor(Math.random() * 31) // Random day between 1 and 31
    );

    const weight = Math.random() * (700 - 10) + 10; // Random weight between 10 and 700 quintals
    let price = Math.random() * (4500 - 1000) + 1000; // Random price between 1000 and 4500 INR per quintal

    // Adjust price for the months of June to September
    const month = date.getMonth();
    if (month >= 5 && month <= 8) {
      price += 20; // Add a premium price during June to September
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
  } catch (error) {
    console.error("Error:", error);
  }
};

// Function to create and save 1000 random transactions
const createRandomTransactions = async () => {
  try {
    const transactions = [];
    for (let i = 0; i < 1000; i++) {
      transactions.push(await generateRandomTransaction());
    }
    await TomatoTransaction.insertMany(transactions);
    console.log("1000 random transactions inserted successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

createRandomTransactions(); 
