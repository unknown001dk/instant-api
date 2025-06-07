import mongoose from "mongoose";
import { encryptPassword } from "../utils/secure.js";
import inferredRegexPatterns from "../utils/regexPattern.js";

/**
 * PATCH controller to update a document by ID with validation and encryption support.
 *
 * @param {Object} params
 * @param {Object} params.req - Express request object
 * @param {Object} params.res - Express response object
 * @param {Object} params.DynamicModel - Mongoose model instance
 * @param {string} params.documentId - ID of the document to update
 * @param {Object} params.schemaData - Custom schema metadata with secure field config
 */
export const handlePatchRequest = async ({
  req,
  res,
  DynamicModel,
  documentId,
  schemaData,
}) => {
  try {
    // Validate schema data
    if (!schemaData?.schemaDefinition) {
      return res.status(500).json({
        success: false,
        message: "Schema definition is missing. Update cannot proceed.",
      });
    }

    const updateData = req.body;
    const schemaPaths = DynamicModel.schema.paths;
    const secureFields = schemaData.schemaDefinition.filter((f) => f.secure);
    const validationErrors = [];

    // Validate fields in the update payload
    for (const field in updateData) {
      const value = updateData[field];
      const schemaField = schemaPaths[field];
      if (!schemaField) continue;

      // Validate required (if provided)
      if (schemaField.isRequired && (value === undefined || value === "")) {
        validationErrors.push(`${field} is required.`);
      }

      // Schema-defined regex
      const definedRegex = schemaField.options?.match;
      if (definedRegex && typeof value === "string") {
        const regex =
          definedRegex instanceof RegExp
            ? definedRegex
            : new RegExp(definedRegex);
        if (!regex.test(value)) {
          validationErrors.push(`${field} does not match expected format.`);
        }
      }

      // Inferred regex pattern fallback (based on keyword match)
      const inferred = inferredRegexPatterns.find((r) =>
        field.toLowerCase().includes(r.keyword)
      );
      if (inferred && !inferred.pattern.test(value)) {
        validationErrors.push(`${field}: ${inferred.message}`);
      }

      // Encrypt secure fields
      const secureField = secureFields.find((f) => f.name === field);
      if (secureField && value) {
        updateData[field] = encryptPassword(value, secureField.secretKey);
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation errors encountered.",
        errors: validationErrors,
      });
    }

    // Validate document ID
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID format.",
      });
    }

    // Attempt to update the document
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
    // Handle duplicate key errors
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Duplicate entry: ${duplicateField} must be unique.`,
      });
    }

    // Handle other server errors
    return res.status(500).json({
      success: false,
      message: error.message || "Unexpected server error during update.",
    });
  }
};
