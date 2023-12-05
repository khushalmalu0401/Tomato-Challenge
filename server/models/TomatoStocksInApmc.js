const mongoose = require("mongoose");

const dailyStocksUpdateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "APMC", // Reference to the APMC model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number, // You can change the type to match your data structure
    default: 0, // You can set a default value if needed
  },

  totalStocks: {
    type: Number,
    default: 0,
  },
});

const DailyStocksUpdate = mongoose.model(
  "DailyStocksUpdate",
  dailyStocksUpdateSchema
);

module.exports = DailyStocksUpdate;
