const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const random_name = require('random-indian-name');

mongoose.connect('mongodb+srv://riteshlade10:VXsKtWnrDkQhlEqm@tomatochallenge1.mrvavwx.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
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

const User = mongoose.model('User', userSchema);

const generateRandomUserData = () => {
  const name = random_name();
  const phone = Math.floor(Math.random() * 10000000000);
  const password = 'your-password'; // Set the desired password
  const cpassword = password;
  return {
    name,
    phone,
    password,
    cpassword,
    tokens: [],
  };
};

const createRandomUsers = async (count) => {
  for (let i = 0; i < count; i++) {
    const userData = generateRandomUserData();

    // Hash the password and cpassword before saving
    const user = new User(userData);
    user.password = await bcrypt.hash(userData.password, 12);
    user.cpassword = await bcrypt.hash(userData.cpassword, 12);
    // console.log(user);
    await user.save();
  }
  // console.log(`${count} random users inserted successfully.`);
  mongoose.connection.close();
};

createRandomUsers(420); // Change the number to the desired user count
