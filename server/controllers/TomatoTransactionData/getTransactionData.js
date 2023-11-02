const TomatoData = require("../../models/TomatoTransactionSchema");

const GetTransactionData = async (req, res) => {
  try {
    // Extract the year from the request query or params, depending on how it is sent
    const { year } = req.query; // Change to req.params if using URL parameters

    if (!year) {
      return res.status(400).json({ error: "Year parameter is required." });
    }

    // Query your MongoDB collection for data based on the selected year
    const tomatoData = await TomatoData.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`), // Start of the year
            $lt: new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`), // Start of the next year
          },
        },
      },
    ]);

    res.status(200).json(tomatoData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetTransactionData;
