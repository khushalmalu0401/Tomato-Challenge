const mongoose = require('mongoose');
const faker = require('faker');
const csv = require('csv-parser');
const fs = require('fs');

mongoose.connect('mongodb+srv://riteshlade10:VXsKtWnrDkQhlEqm@tomatochallenge1.mrvavwx.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });

const apmcSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  commodities: [
    {
      type: String,
      required: true,
    },
  ],
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const APMC = mongoose.model('APMC', apmcSchema);

const requiredCommodities = ['Tomato'];
const otherCommodities = ['Potato', 'Onion', 'Cauliflower', 'Cabbage', 'Carrot', 'Spinach', 'Capsicum', 'Brinjal'];

const generateDummyAPMC = (state, city) => {
  const randomCommodities = [
    ...requiredCommodities,
    ...faker.random.arrayElements(otherCommodities, faker.datatype.number({ min: 2, max: 5 })),
  ];

  return new APMC({
    name: `APMC-${city}`,
    location: city,
    pinCode: faker.address.zipCode(),
    state: state,
    district: city,
    commodities: randomCommodities,
    email: `apmc.${city}@gmail.com`,
    password: '1234',
    cpassword: '1234',
    phone: faker.phone.phoneNumberFormat(),
  });
};

const dummyData = [];

fs.createReadStream('indian_cities_modified.csv')
  .pipe(csv())
  .on('data', (row) => {
    dummyData.push(generateDummyAPMC(row.State, row.City));
  })
  .on('end', async () => {
    for (const data of dummyData) {
      // Save the APMC document to MongoDB one by one
      try {
        await data.save();
      } catch (err) {
        console.error('Error inserting dummy data:', err);
      }
    }
    console.log('Dummy data insertion completed.');
    mongoose.connection.close(); // Close the MongoDB connection when finished
  });


// APMC.insertMany(dummyData, (err) => {
//   if (err) {
//     console.error('Error inserting dummy data:', err);
//   } else {
//     console.log('Dummy data inserted successfully.');
//   }
// });

// const fs = require("fs");
// const { createObjectCsvWriter } = require("csv-writer");

// const indianCitiesDatabase = require("indian-cities-database");
// const cities = indianCitiesDatabase.cities;

// // Create an object to store cities by state
// const citiesByState = {};

// // Iterate through the cities and group them by state
// cities.forEach((city) => {
//   const state = city.state;
//   const cityName = city.city;

//   if (!citiesByState[state]) {
//     citiesByState[state] = [];
//   }

//   if (citiesByState[state].length < 5) {
//     citiesByState[state].push(cityName);
//   }
// });

// // Prepare the data for writing to the CSV file
// const csvData = [];
// for (const state in citiesByState) {
//   citiesByState[state].forEach((city) => {
//     csvData.push({ State: state, City: city });
//   });
// }

// // Define the CSV writer
// const csvWriter = createObjectCsvWriter({
//   path: "indian_cities.csv",
//   header: [
//     { id: "State", title: "State" },
//     { id: "City", title: "City" },
//   ],
// });

// // Write the data to the CSV file
// csvWriter
//   .writeRecords(csvData)
//   .then(() => {
//     console.log("CSV file has been written successfully.");
//   })
//   .catch((error) => {
//     console.error("Error writing CSV file:", error);
//   });
