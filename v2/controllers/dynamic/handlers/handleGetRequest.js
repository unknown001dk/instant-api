// import mongoose from "mongoose";
// import pino from "pino";

// const logger = pino({ timestamp: pino.stdTimeFunctions.isoTime });

// export const handleGetRequest = async ({
//   req,
//   res,
//   DynamicModel,
//   documentId,
// }) => {
//   try {
//     const { filter, select, sort, page = 1, limit = 10 } = req.query;

//     const restrictedFields = ["password", "ssn", "creditCardNumber"];

//     let queryFilter = {};
//     if (filter) {
//       try {
//         queryFilter = JSON.parse(filter);

//         const hasRestrictedFilter = restrictedFields.some((field) =>
//           Object.keys(queryFilter).includes(field)
//         );
//         if (hasRestrictedFilter) {
//           logger.warn(`Restricted filter field used: ${filter}`);
//           return res.status(400).json({
//             success: false,
//             message: "Filtering on sensitive fields is not allowed.",
//           });
//         }

//         const allowedOperators = [
//           "$gt",
//           "$gte",
//           "$lt",
//           "$lte",
//           "$in",
//           "$nin",
//           "$regex",
//           "$ne",
//           "$or",
//           "$and",
//           "$exists",
//           "$options",
//           "$not",
//           "$nor",
//         ];
//         const operatorMatches = JSON.stringify(queryFilter).match(/\$\w+/g);
//         if (operatorMatches) {
//           const hasInvalidOperator = operatorMatches.some(
//             (op) => !allowedOperators.includes(op)
//           );
//           if (hasInvalidOperator) {
//             logger.warn(`Invalid MongoDB operator in filter: ${filter}`);
//             return res.status(400).json({
//               success: false,
//               message: "Unsupported query operator in filter.",
//             });
//           }
//         }
//       } catch (parseErr) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid filter format. Must be a valid JSON string.",
//         });
//       }
//     }

//     if (select && restrictedFields.some((field) => select.includes(field))) {
//       logger.warn(`Restricted field in select: ${select}`);
//       return res.status(400).json({
//         success: false,
//         message: "Selection of sensitive fields is not allowed.",
//       });
//     }

//     const pageNum = Math.max(parseInt(page, 10), 1);
//     const limitNum = Math.max(parseInt(limit, 10), 1);
//     const skip = (pageNum - 1) * limitNum;

//     const fieldsToSelect = select
//       ? select
//           .split(",")
//           .filter((f) => !restrictedFields.includes(f.trim()))
//           .join(" ")
//       : "-password";

//     // Automatically detect refs from schema paths
//     const refFields = Object.entries(DynamicModel.schema.paths)
//       .filter(([key, path]) => path.options?.ref)
//       .map(([key]) => key);
 
//     const populateFields = refFields.join(" ");

//     const query = documentId
//       ? DynamicModel.findById(documentId).select("-password")
//       : DynamicModel.find(queryFilter)
//           .select(fieldsToSelect)
//           .sort(sort || "-createdAt")
//           .skip(skip)
//           .limit(limitNum);

//     if (populateFields) {
//       query.populate(populateFields);
//     }

//     const result = await query;

//     const totalCount = documentId
//       ? result
//         ? 1
//         : 0
//       : await DynamicModel.countDocuments(queryFilter);

//     if (!result || (Array.isArray(result) && result.length === 0)) {
//       return res.status(404).json({
//         success: false,
//         message: documentId
//           ? `Document with ID ${documentId} not found.`
//           : "No records found matching the query.",
//       });
//     }

//     return res.json({
//       success: true,
//       totalRecords: totalCount,
//       currentPage: pageNum,
//       pageSize: limitNum,
//       data: result,
//     });
//   } catch (error) {
//     logger.error({ error: error.message }, "Error during GET operation.");
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error occurred.",
//     });
//   }
// };


import mongoose from "mongoose";
import pino from "pino";

const logger = pino({ timestamp: pino.stdTimeFunctions.isoTime });

export const handleGetRequest = async ({ req, res, DynamicModel, documentId }) => {
  try {
    const { filter, select, sort, page = 1, limit = 10 } = req.query;
    const { permissions } = req.permission; // Fetch permissions from middleware
    const restrictedFields = ["password", "ssn", "creditCardNumber"]; // Sensitive fields

    // Check if the user has view permissions
    if (!permissions.view) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this resource.",
      });
    }

    // Process field selection based on permissions
    const allowedFields = permissions.fields.view || [];
    const fieldsToSelect = select
      ? select
          .split(",")
          .filter((field) => allowedFields.includes(field.trim()) || allowedFields.includes("*"))
          .join(" ")
      : allowedFields.includes("*")
      ? "" // Empty means select all fields
      : allowedFields.join(" ") || "-password"; // Default: exclude sensitive fields

    // Build query filters
    let queryFilter = {};
    if (filter) {
      try {
        queryFilter = JSON.parse(filter);

        // Check if filter includes restricted fields
        const hasRestrictedFilter = restrictedFields.some((field) =>
          Object.keys(queryFilter).includes(field)
        );
        if (hasRestrictedFilter) {
          logger.warn(`Restricted filter field used: ${filter}`);
          return res.status(400).json({
            success: false,
            message: "Filtering on sensitive fields is not allowed.",
          });
        }

        // Validate allowed MongoDB operators
        const allowedOperators = [
          "$gt", "$gte", "$lt", "$lte", "$in", "$nin", "$regex", "$ne",
          "$or", "$and", "$exists", "$options", "$not", "$nor",
        ];
        const operatorMatches = JSON.stringify(queryFilter).match(/\$\w+/g);
        if (operatorMatches) {
          const hasInvalidOperator = operatorMatches.some(
            (op) => !allowedOperators.includes(op)
          );
          if (hasInvalidOperator) {
            logger.warn(`Invalid MongoDB operator in filter: ${filter}`);
            return res.status(400).json({
              success: false,
              message: "Unsupported query operator in filter.",
            });
          }
        }
      } catch (parseErr) {
        return res.status(400).json({
          success: false,
          message: "Invalid filter format. Must be a valid JSON string.",
        });
      }
    }

    // Restrict sensitive fields in 'select'
    if (select && restrictedFields.some((field) => select.includes(field))) {
      logger.warn(`Restricted field in select: ${select}`);
      return res.status(400).json({
        success: false,
        message: "Selection of sensitive fields is not allowed.",
      });
    }

    // Pagination setup
    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.max(parseInt(limit, 10), 1);
    const skip = (pageNum - 1) * limitNum;

    // Build the query
    const query = documentId
      ? DynamicModel.findById(documentId).select(fieldsToSelect)
      : DynamicModel.find(queryFilter)
          .select(fieldsToSelect)
          .sort(sort || "-createdAt")
          .skip(skip)
          .limit(limitNum);

    // Automatically detect and populate references in schema
    const refFields = Object.entries(DynamicModel.schema.paths)
      .filter(([key, path]) => path.options?.ref)
      .map(([key]) => key);

    const populateFields = refFields.join(" ");
    if (populateFields) {
      query.populate(populateFields);
    }

    // Execute the query
    const result = await query;

    // Count total documents for pagination
    const totalCount = documentId
      ? result
        ? 1
        : 0
      : await DynamicModel.countDocuments(queryFilter);

    // Handle no results
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(404).json({
        success: false,
        message: documentId
          ? `Document with ID ${documentId} not found.`
          : "No records found matching the query.",
      });
    }

    // Return the data with metadata
    return res.json({
      success: true,
      totalRecords: totalCount,
      currentPage: pageNum,
      pageSize: limitNum,
      data: result,
    });
  } catch (error) {
    // Handle errors
    logger.error({ error: error.message }, "Error during GET operation.");
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
};