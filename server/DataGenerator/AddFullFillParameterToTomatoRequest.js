const mongoose = require("mongoose");
const TomatoRequest = require("../models/TomatoRequest"); // Adjust the path as needed

// Connect to your MongoDB database
mongoose.connect("mongodb+srv://riteshlade10:VXsKtWnrDkQhlEqm@tomatochallenge1.mrvavwx.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateTomatoRequests = async () => {
  try {
    const startDate = new Date("2023-11-26");
    const endDate = new Date("2023-11-28");

    // Update TomatoRequest documents for the specified date range
    const result = await TomatoRequest.updateMany(
      {
        date: { $gte: startDate, $lte: endDate },
      },
      { $set: { fullfill: false } }
    );

    console.log("TomatoRequests updated successfully. Matched:", result.n, "Modified:", result.nModified);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

// Call the function to update TomatoRequest documents
updateTomatoRequests();
