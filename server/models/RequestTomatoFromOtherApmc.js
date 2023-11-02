const mongoose = require("mongoose");

// Define the schema for tomato data
const RequestTomatoFromOtherApmcSchema = new mongoose.Schema({
  apmcMarketRequesting: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    }
  },
  apmcProviding: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    }
  },
  weight: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    get: (date) => {
      console.log("get function called");
      // Format the date as YYYY-MM-DD without trailing zeros
      return date.toISOString().split("T")[0];
    },
    required: true,
  },
});

// Create a model for the tomato data
const RequestTomatoFromOtherApmc = mongoose.model(
  "RequestTomatoOtherApmc",
  RequestTomatoFromOtherApmcSchema
);

module.exports = RequestTomatoFromOtherApmc;
