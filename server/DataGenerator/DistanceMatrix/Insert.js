const mongoose = require("mongoose");
const xlsx = require("xlsx");
const fs = require("fs/promises");

mongoose.connect(
  "mongodb+srv://tomatachallenge:admin@tomatachallenge.mdm3cn8.mongodb.net/",
  {
    useNewUrlParser: true,
  }
);

// Define the schema for the DistanceMatrix data
const distanceSchema = new mongoose.Schema({
  City1: { type: String, required: true },
  City2: { type: String, required: true },
  Distance: { type: Number, required: true },
});
// Create a model for the DistanceMatrix data
const DistanceModel = mongoose.model("Distance", distanceSchema);

const readAndInsertData = async () => {
  try {
    // Read the Excel file
    const fileData = await fs.readFile("DistanceMatrix.xlsx");
    const workbook = xlsx.read(fileData, { type: "buffer" });

    // Assuming the data is in the first sheet (you may need to adjust accordingly)
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Parse the sheet data
    const data = xlsx.utils.sheet_to_json(sheet);

    // Insert data into the MongoDB collection
    await DistanceModel.insertMany(data);

    // console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
};

// Call the function to read and insert data
readAndInsertData();
