const TomatoRequestSchema = require("../../../models/TomatoRequest");

const cancelTomatoRequest = async (req, res) => {
  try {
    const requestId = req.params.id; // Assuming the request ID is provided in the request parameters
    // console.log(requestId)

    // Check if the request ID is valid
    if (!requestId) {
      return res.status(422).json({ error: "Invalid request ID" });
    }

    // Find the tomato request by ID
    const tomatoRequest = await TomatoRequestSchema.findById(requestId);

    // Check if the request exists
    if (!tomatoRequest) {
      return res.status(404).json({ error: "Tomato request not found" });
    }

    // Check if the request is cancellable (you can modify this condition based on your criteria)
    // const isCancellable = true; // Add your cancellation logic here

    // if (isCancellable) {
    // Remove the tomato request from the database
    await TomatoRequestSchema.findByIdAndDelete(requestId);

    return res
      .status(200)
      .json({ message: "Tomato request cancelled successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = cancelTomatoRequest;
