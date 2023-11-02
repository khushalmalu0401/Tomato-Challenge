const TomatoData = require("../../models/TomatoTransactionSchema");

const GetData = async (req, res) => {
  try {
    const { selectedOption } = req.query;
    const { farmerPhone } = req.query;

    if (!farmerPhone && !selectedOption) {
      return res.status(400).json({ error: "Option is required." });
    }

    // Query your MongoDB collection for data based on the selected option
    if (farmerPhone) {
      const tomatoData = await TomatoData.find({ "farmer.phone": farmerPhone });
      console.log(tomatoData);
      return res.status(200).json(tomatoData);
    } else if (selectedOption) {
      const tomatoData = await TomatoData.find({
        "apmcMarket.name": selectedOption,
      });
      console.log(tomatoData);
      res.status(200).json(tomatoData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetData;
