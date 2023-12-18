const mongoose = require("mongoose");
const APMC = require("../models/apmcSchema");
const Vendor = require("../models/vendorSchema");
const TomatoRequest = require("../models/TomatoRequest");

mongoose.connect(
  "mongodb+srv://riteshlade10:VXsKtWnrDkQhlEqm@tomatochallenge1.mrvavwx.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const deleteRequestsForDateRange = async () => {
    try {
      // Set your desired start and end dates
      const startDate = new Date("2023-11-25");
      const endDate = new Date("2023-11-27");
  
      // Delete requests within the date range
      const result = await TomatoRequest.deleteMany({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
  
      // console.log(`Deleted ${result.deletedCount} requests.`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      mongoose.connection.close();
    }
  };
  
  // Call the function to delete requests
  deleteRequestsForDateRange();
  
