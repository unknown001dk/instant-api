import pino from "pino";

const logger = pino({ timestamp: pino.stdTimeFunctions.isoTime });

/**
 * Handles GET requests for dynamic models with support for:
 * - Role-based permissions
 * - Query filters and projections
 * - Pagination
 * - Reference population
 */
export const handleGetRequest = async ({ req, res, DynamicModel, documentId }) => {
  try {
    const { filter, select, sort, page = 1, limit = 10 } = req.query;
    const { permissions } = req.permission || {};
    const restrictedFields = ["password", "ssn", "creditCardNumber"];

    // Authorization check
    if (!permissions?.view) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this resource.",
      });
    }

    // Build allowed field selection string
    const allowedFields = permissions.fields?.view || [];
    const fieldsToSelect = select
      ? select
          .split(",")
          .filter(field => allowedFields.includes(field.trim()) || allowedFields.includes("*"))
          .join(" ")
      : allowedFields.includes("*")
      ? ""
      : allowedFields.join(" ") || "-password";

    // Parse and validate query filters
    let queryFilter = {};
    if (filter) {
      try {
        queryFilter = JSON.parse(filter);

        // Restrict filter usage on sensitive fields
        const hasRestrictedField = Object.keys(queryFilter).some(field =>
          restrictedFields.includes(field)
        );
        if (hasRestrictedField) {
          logger.warn(`Blocked filter using restricted field: ${filter}`);
          return res.status(400).json({
            success: false,
            message: "Filtering on sensitive fields is not allowed.",
          });
        }

        // Validate supported MongoDB operators
        const allowedOperators = [
          "$gt", "$gte", "$lt", "$lte", "$in", "$nin", "$regex", "$ne",
          "$or", "$and", "$exists", "$options", "$not", "$nor"
        ];
        const foundOperators = JSON.stringify(queryFilter).match(/\$\w+/g);
        if (foundOperators?.some(op => !allowedOperators.includes(op))) {
          logger.warn(`Invalid MongoDB operator used: ${filter}`);
          return res.status(400).json({
            success: false,
            message: "Unsupported query operator in filter.",
          });
        }

      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid filter format. Filter must be a valid JSON string.",
        });
      }
    }

    // Restrict selection of sensitive fields
    if (select && restrictedFields.some(field => select.includes(field))) {
      logger.warn(`Attempted selection of restricted field: ${select}`);
      return res.status(400).json({
        success: false,
        message: "Selection of sensitive fields is not allowed.",
      });
    }

    // Setup pagination
    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.max(parseInt(limit, 10), 1);
    const skip = (pageNum - 1) * limitNum;

    // Build Mongoose query
    const query = documentId
      ? DynamicModel.findById(documentId).select(fieldsToSelect)
      : DynamicModel.find(queryFilter)
          .select(fieldsToSelect)
          .sort(sort || "-createdAt")
          .skip(skip)
          .limit(limitNum);

    // Automatically populate referenced fields
    const populateFields = Object.entries(DynamicModel.schema.paths)
      .filter(([_, path]) => path.options?.ref)
      .map(([key]) => key)
      .join(" ");
    if (populateFields) {
      query.populate(populateFields);
    }

    // Execute query
    const result = await query;
    const totalCount = documentId
      ? (result ? 1 : 0)
      : await DynamicModel.countDocuments(queryFilter);

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(404).json({
        success: false,
        message: documentId
          ? `Document with ID '${documentId}' not found.`
          : "No records found matching the criteria.",
      });
    }

    // Success response
    return res.json({
      success: true,
      totalRecords: totalCount,
      currentPage: pageNum,
      pageSize: limitNum,
      data: result,
    });
  } catch (error) {
    logger.error({ error: error.message }, "Error during GET operation");
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
};
