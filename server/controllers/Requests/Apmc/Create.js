const RequestTomatoFromOtherApmc = require("../../../models/RequestTomatoFromOtherApmc");
const ApmcMarket = require("../../../models/ApmcSchema");

const RequestTomatoFromOtherApmcComponent = async (req, res) => {
  try {
    const {
      apmcRequestingId,
      apmcRequestingName,
      apmcProvidingName,
      requestWeight,
    } = req.body;

    if (
      !apmcRequestingId ||
      !apmcRequestingName ||
      !apmcProvidingName ||
      !requestWeight
    ) {
      return res
        .status(422)
        .json({ error: "Please fill in all the fields properly." });
    }

    const dateOnly = new Date().toISOString().split("T")[0];

    let apmcPrice;

    const apmcMarket = await ApmcMarket.findOne({ name: apmcProvidingName });

    if (apmcMarket) {
      apmcPrice = apmcMarket.currentPrice;
    } else {
      return res.status(404).json({ error: "Apmc Market not found" });
    }

    const tomatoTransData = new RequestTomatoFromOtherApmc({
      apmcMarketRequesting: {
        id: apmcRequestingId,
        name: apmcRequestingName,
      },
      apmcProviding: {
        id: apmcMarket._id,
        name: apmcProvidingName,
      },
      weight: requestWeight,
      price: apmcPrice,
      date: dateOnly,
    });

    await tomatoTransData.save();

    res.status(200).json({ message: "Tomato data submitted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = RequestTomatoFromOtherApmcComponent;
