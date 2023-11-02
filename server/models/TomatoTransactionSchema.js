const mongoose = require("mongoose");

// Define the schema for tomato data
const TomatoTransactionSchema = new mongoose.Schema({
  apmcMarket: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  farmer: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
  },
  weight: {
    type: Number,
    required: true,
  },
  price: {
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
const TomatoTransaction = mongoose.model("TomatoData", TomatoTransactionSchema);

module.exports = TomatoTransaction;
