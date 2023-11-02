const mongoose = require("mongoose");
const APMC = require("./models/ApmcSchema"); // Replace with the correct path to your APMC model

const dbUri =
  "mongodb+srv://riteshlade10:VXsKtWnrDkQhlEqm@tomatochallenge1.mrvavwx.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", async () => {
  console.log("Connected to MongoDB database.");

  // Generate random prices and update each APMC entry
  try {
    const apmcEntries = await APMC.find({}); // Fetch all APMC entries

    for (const apmcEntry of apmcEntries) {
      // Generate a random price between 1000 and 4500
      const randomPrice = Math.floor(Math.random() * (4500 - 1000 + 1)) + 1000;

      // Update the APMC entry with the "currentPrice" field
      apmcEntry.currentPrice = randomPrice;

      try {
        // Save the updated APMC entry
        await apmcEntry.save();
        console.log(
          `Updated ${apmcEntry.name} with currentPrice: ${randomPrice}`
        );
      } catch (error) {
        console.error(`Error updating ${apmcEntry.name}:`, error);
      }
    }
  } catch (error) {
    console.error("Error updating APMC entries:", error);
  }

  // Close the MongoDB connection when done
  mongoose.connection.close();
});
