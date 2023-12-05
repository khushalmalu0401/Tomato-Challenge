const TomatoData = require("../../models/TomatoTransactionSchema");

const DeleteData = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the data with the given ID exists
    const existingData = await TomatoData.findById(id);

    if (!existingData) {
      return res.status(404).json({ error: "Data not found" });
    }

    // Delete the data from the database
    await TomatoData.deleteOne({ _id: id });

    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = DeleteData;
