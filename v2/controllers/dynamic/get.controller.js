import pino from "pino";
const logger = pino({ timestamp: pino.stdTimeFunctions.isoTime });

const GETOperation = async(req, res) => {
  try {
    const { filter, select, sort, page = 1, limit = 10 } = req.query;

    // Parse the filter query
    const queryFilter = filter ? JSON.parse(filter) : {};
    const restrictedFields = ["password", "ssn", "creditCardNumber"];

    // Validate filter for restricted fields
    const containsRestrictedField = restrictedFields.some((field) =>
      Object.keys(queryFilter).includes(field)
    );

    if (containsRestrictedField) {
      logger.warn(
        `Attempted filter on restricted field: ${JSON.stringify(filter)}`
      );
      return res.status(400).json({
        success: false,
        message: "Filtering on sensitive fields is not allowed.",
      });
    }

    // Pagination setup
    const skip = (page - 1) * parseInt(limit, 10);

    // Fetch results
    result = documentId
      ? await DynamicModel.findById(documentId).select("-password")
      : await DynamicModel.find(queryFilter)
          .select(select ? `${select.split(",").join(" ")}` : "-password") // Select fields, exclude password
          .sort(sort || "-createdAt") // Sort results
          .skip(skip) // Pagination: skip records
          .limit(parseInt(limit, 10)); // Limit the number of results

    // Handle no results
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(404).json({
        success: false,
        message: documentId
          ? `Document with ID ${documentId} not found.`
          : "No records found matching the query.",
      });
    }

    // Send the results
    return res.json({
      success: true,
      totalRecords: Array.isArray(result) ? result.length : 1,
      data: result,
    });
  } catch (error) {
    // Log the error and send a 500 response
    logger.error({ error: error.message }, "Error during GET operation.");
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
}

export default GETOperation;