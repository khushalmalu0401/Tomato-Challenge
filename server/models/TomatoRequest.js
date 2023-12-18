const mongoose = require("mongoose");

// Define the schema for tomato data
const TomatoRequest = new mongoose.Schema({
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
  vendor: {
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
  date: {
    type: Date,
    get: (date) => {
      // console.log("get function called");
      // Format the date as YYYY-MM-DD without trailing zeros
      return date.toISOString().split("T")[0];
    },
    required: true,
  },
  fullfill: {
    type: Boolean,
    default: false,
  },
  paymentDone: {
    type: Boolean,
    default: false,
  },
});

// Create a model for the tomato data
const TomatoTransaction = mongoose.model("TomatoRequest", TomatoRequest);

module.exports = TomatoTransaction;
