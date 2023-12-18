// const TomatoData = require("../../models/TomatoData");
const TomatoTransactionSchema = require("../../models/TomatoTransactionSchema");
const ApmcMarket = require("../../models/ApmcSchema");
const Farmer = require("../../models/FarmerSchema");
const TomatoStocksInApmc = require("../../models/TomatoStocksInApmc");

const PostData = async (req, res) => {
  // try {
  const {
    name,
    phoneNumber,
    apmcMarketName,
    apmcId,
    weight,
    price,
    todaydate,
  } = req.body;

  // console.log(req.body);

  if (
    !name ||
    !phoneNumber ||
    !apmcMarketName ||
    !apmcId ||
    !weight ||
    !price
  ) {
    return res
      .status(422)
      .json({ error: "Please fill in all the fields properly." });
  }
  // Create a new instance of the TomatoData model
  let dateOnly;
  if (!todaydate) {
    dateOnly = new Date().toISOString().split("T")[0];
    // dateOnly = .split("T")[0];
  } else {
    dateOnly = new Date(todaydate).toISOString().split("T")[0];
    // dateOnly = date.toISOString().split("T")[0];
  }
  // console.log(dateOnly);

  let apmcLocation, apmcState;
  await ApmcMarket.findOne({ _id: apmcId })
    .then((apmcMarket) => {
      if (apmcMarket) {
        apmcLocation = apmcMarket.location;
        apmcState = apmcMarket.state;
        // console.log(apmcMarket);
      } else {
        // console.log("Apmc Market not found");
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the query
      console.error("Error:", error);
    });

  let farmerId;
  await Farmer.findOne({ phone: phoneNumber })
    .then((farmer) => {
      if (farmer) {
        farmerId = farmer._id;
      } else {
        // console.log("Farmer not found");
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the query
      console.error("Error:", error);
    });

  const tomatoTransData = new TomatoTransactionSchema({
    apmcMarket: {
      id: apmcId,
      name: apmcMarketName,
      location: apmcLocation,
      state: apmcState,
    },
    farmer: {
      id: farmerId,
      name: name,
      phone: phoneNumber,
    },
    weight,
    price,
    date: dateOnly,
  });

  // Save the data to the MongoDB collection
  // console.log(apmcId, apmcMarketName, apmcLocation, apmcState, farmerId);
  await tomatoTransData.save();

  await TomatoStocksInApmc.updateOne(
    { date: dateOnly, id: apmcId },
    {
      $set: {
        name: apmcMarketName,
        date: dateOnly,
        id: apmcId,
        price: price,
      },
      $inc: {
        totalStocks: weight,
      },
    },
    { upsert: true } // Creates a new document if no match is found
  );
  res.status(200).json({ message: "Tomato data submitted successfully" });
  // } catch (error) {
  //   res.status(500).json({ error: "Internal server error" });
  // }
};

module.exports = PostData;
