const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const faker = require("faker");
const random_name = require("random-indian-name");

mongoose.connect(
  "mongodb+srv://riteshlade10:VXsKtWnrDkQhlEqm@tomatochallenge1.mrvavwx.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

const Vendor = mongoose.model("Vendor", VendorSchema);

const generateRandomVendorData = () => {
  const name = random_name();
  const phone = Math.floor(Math.random() * 10000000000);
  const password = "your-password"; // Set the desired password
  const cpassword = password;
  return {
    name,
    phone,
    password,
    cpassword,
    tokens: [],
  };
};

const createRandomVendors = async (count) => {
  for (let i = 0; i < count; i++) {
    const vendorData = generateRandomVendorData();

    // Hash the password and cpassword before saving
    const vendor = new Vendor(vendorData);
    vendor.password = await bcrypt.hash(vendorData.password, 12);
    vendor.cpassword = await bcrypt.hash(vendorData.cpassword, 12);
    // console.log(vendor);
    await vendor.save();
  }
  console.log(`${count} random vendors inserted successfully.`);
  mongoose.connection.close();
};

createRandomVendors(280); // Change the number to the desired Vendor count
