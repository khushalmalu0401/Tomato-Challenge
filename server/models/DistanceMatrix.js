const mongoose = require("mongoose");

const distanceSchema = new mongoose.Schema({
  City1: { type: String, required: true },
  City2: { type: String, required: true },
  Distance: { type: Number, required: true },
});
// Create a model for the DistanceMatrix data
const DistanceModel = mongoose.model("Distance", distanceSchema);

module.exports = DistanceModel;
