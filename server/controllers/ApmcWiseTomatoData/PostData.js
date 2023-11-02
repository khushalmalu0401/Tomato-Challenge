// const TomatoData = require("../../models/TomatoData");
const TomatoTransactionSchema = require("../../models/TomatoTransactionSchema");
const ApmcMarket = require("../../models/ApmcSchema");
const Farmer = require("../../models/userSchema");

const PostData = async (req, res) => {
  try {
    const {
      farmerName,
      phoneNumber,
      apmcMarketName,
      apmcId,
      weight,
      price,
      date,
    } = req.body;

    // console.log(req.body);

    if (
      !farmerName ||
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
    if (!date) {
      dateOnly = new Date().toISOString().split("T")[0];
      // dateOnly = .split("T")[0];
    } else {
      dateOnly = date.toISOString().split("T")[0];
      // dateOnly = date.toISOString().split("T")[0];
    }
    console.log(dateOnly);

    let apmcLocation, apmcState;
    await ApmcMarket.findOne({ _id: apmcId })
      .then((apmcMarket) => {
        if (apmcMarket) {
          apmcLocation = apmcMarket.location;
          apmcState = apmcMarket.state;
          // console.log(apmcMarket);
        } else {
          console.log("Apmc Market not found");
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
          console.log("Farmer not found");
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
        name: farmerName,
        phone: phoneNumber,
      },
      weight,
      price,
      date: dateOnly,
    });

    // Save the data to the MongoDB collection
    console.log(apmcId, apmcMarketName, apmcLocation, apmcState, farmerId);
    await tomatoTransData.save();

    res.status(200).json({ message: "Tomato data submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = PostData;
