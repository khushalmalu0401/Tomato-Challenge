// const TomatoData = require("../../models/TomatoData");
const TomatoRequest = require("../../../models/TomatoRequest");
const ApmcMarket = require("../../../models/ApmcSchema");
const Farmer = require("../../../models/FarmerSchema");

const RequestTomato = async (req, res) => {
  //   try {
  const {
    vendorId,
    vendorName,
    phoneNumber,
    apmcMarketName,
    apmcId,
    requestWeight,
  } = req.body;

  // console.log(req.body);

  if (
    !vendorId ||
    !vendorName ||
    !phoneNumber ||
    !apmcMarketName ||
    !apmcId ||
    !requestWeight
  ) {
    return res
      .status(422)
      .json({ error: "Please fill in all the fields properly." });
  }
  // Create a new instance of the TomatoData model
  const dateOnly = new Date().toISOString().split("T")[0];

  // console.log(dateOnly);

  let apmcLocation, apmcState, apmcPrice;
  await ApmcMarket.findOne({ _id: apmcId })
    .then((apmcMarket) => {
      if (apmcMarket) {
        apmcLocation = apmcMarket.location;
        apmcState = apmcMarket.state;
        apmcPrice = apmcMarket.currentPrice;
        // console.log(apmcMarket);
      } else {
        // console.log("Apmc Market not found");
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the query
      // console.error("Error:", error);
    });

  const tomatoTransData = new TomatoRequest({
    apmcMarket: {
      id: apmcId,
      name: apmcMarketName,
      location: apmcLocation,
      state: apmcState,
    },
    vendor: {
      id: vendorId,
      name: vendorName,
      phone: phoneNumber,
    },
    weight: requestWeight,
    price: apmcPrice,
    date: dateOnly,
  });

  // Save the data to the MongoDB collection
  // console.log(apmcId, apmcMarketName, apmcLocation, apmcState);
  await tomatoTransData.save();

  res.status(200).json({ message: "Tomato data submitted successfully" });
  //   } catch (error) {
  //     res.status(500).json({ error: "Internal server error" });
  //   }
};

module.exports = RequestTomato;
