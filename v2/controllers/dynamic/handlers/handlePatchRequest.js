import mongoose from "mongoose";
import { encryptPassword } from "../utils/secure.js";
import inferredRegexPatterns from "../utils/regexPattern.js";

export const handlePatchRequest = async ({ req, res, DynamicModel, documentId, schemaData }) => {
  try {
    if (!schemaData || !schemaData.schemaDefinition) {
      return res.status(500).json({
        success: false,
        message: "Missing schema definition.",
      });
    }

    const schemaPaths = DynamicModel.schema.paths;
    const updateData = req.body;
    const validationErrors = [];

    const secureFields = schemaData.schemaDefinition.filter(f => f.secure);

    for (const field in updateData) {
      const path = schemaPaths[field];
      const value = updateData[field];

      if (!path) continue;

      // Required validation (only if field is provided)
      if (path.isRequired && (value === undefined || value === "")) {
        validationErrors.push(`${field} is required.`);
      }

      // Regex (from schema)
      if (path.options?.match && typeof value === "string") {
        const regex = path.options.match instanceof RegExp
          ? path.options.match
          : new RegExp(path.options.match);
        if (!regex.test(value)) {
          validationErrors.push(`${field} is invalid format.`);
        }
      }

      // Regex fallback (inferred patterns)
      const inferred = inferredRegexPatterns.find(r =>
        field.toLowerCase().includes(r.keyword)
      );
      if (inferred && !inferred.pattern.test(value)) {
        validationErrors.push(`${field}: ${inferred.message}`);
      }

      // Secure field encryption
      const secureField = secureFields.find(f => f.name === field);
      if (secureField && value) {
        updateData[field] = encryptPassword(value, secureField.secretKey);
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: validationErrors,
      });
    }

    const result = await DynamicModel.findByIdAndUpdate(documentId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return res.status(404).json({ success: false, message: "Document not found." });
    }

    return res.json({ success: true, result });

  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${duplicateField} must be unique. Duplicate value found.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update document.",
    });
  }
};
