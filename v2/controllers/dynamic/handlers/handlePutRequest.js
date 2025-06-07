import { encryptPassword } from "../utils/secure.js";
import inferredRegexPatterns from "../utils/regexPattern.js";

/**
 * PUT controller to fully replace and update a document by ID.
 * Includes validation, secure field handling, and regex enforcement.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} DynamicModel - Mongoose model
 * @param {string} documentId - ID of the document to update
 * @param {Object} schemaData - Metadata with schema definition
 */
export const handlePutRequest = async ({
  req,
  res,
  DynamicModel,
  documentId,
  schemaData,
}) => {
  try {
    const updateData = req.body;
    const schemaPaths = DynamicModel.schema.paths;
    const validationErrors = [];

    if (!schemaData?.schemaDefinition) {
      return res.status(400).json({
        success: false,
        message: "Schema definition is missing.",
      });
    }

    const secureFields = schemaData.schemaDefinition.filter((field) => field.secure);

    // Encrypt secure fields before validation
    for (const { name, secretKey } of secureFields) {
      if (updateData[name]) {
        updateData[name] = encryptPassword(updateData[name], secretKey);
      }
    }

    // Field validation
    for (const field in updateData) {
      const value = updateData[field];
      const schemaField = schemaPaths[field];
      if (!schemaField) continue;

      // Required check (only if field is defined)
      if (schemaField.isRequired && (value === undefined || value === "")) {
        validationErrors.push(`${field} is required.`);
        continue;
      }

      // Regex from schema
      if (schemaField.options?.match && typeof value === "string") {
        const regex = schemaField.options.match instanceof RegExp
          ? schemaField.options.match
          : new RegExp(schemaField.options.match);
        if (!regex.test(value)) {
          validationErrors.push(`${field} format is invalid.`);
        }
      } else {
        // Fallback to inferred regex patterns
        for (const { keyword, pattern, message } of inferredRegexPatterns) {
          if (
            field.toLowerCase().includes(keyword) &&
            typeof value === "string" &&
            !pattern.test(value)
          ) {
            validationErrors.push(`${field}: ${message}`);
          }
        }
      }

      // Basic type check (number only)
      if (schemaField.instance === "Number" && isNaN(value)) {
        validationErrors.push(`${field} must be a valid number.`);
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validationErrors,
      });
    }

    const updatedDoc = await DynamicModel.findByIdAndUpdate(documentId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return res.status(404).json({
        success: false,
        message: `Document with ID ${documentId} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document updated successfully.",
      result: updatedDoc,
    });

  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Duplicate field: ${duplicateField} must be unique.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error during update.",
    });
  }
};
