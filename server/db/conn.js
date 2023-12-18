const mongoose = require("mongoose");
require("dotenv").config();
const DB = process.env.MONGODB_URI_NEW;

// console.log(DB);

mongoose
  .connect(DB)
  .then(() => {
    console.log(`Connection successful`);
  })
  .catch((err) => {
    console.error(`Connection error: ${err.message}`);
  });
