import { encryptPassword } from "../utils/secure.js";
import inferredRegexPatterns from "../utils/regexPattern.js";

export const handlePutRequest = async ({
  req,
  res,
  DynamicModel,
  documentId,
  schemaData,
}) => {
  try {
    const schemaPaths = DynamicModel.schema.paths;
    const updateData = req.body;
    const validationErrors = [];

    const secureFields = schemaData.schemaDefinition.filter(
      (field) => field.secure
    );

    // 🔐 Encrypt secure fields before validation
    for (const { name, secretKey } of secureFields) {
      if (updateData[name]) {
        updateData[name] = encryptPassword(updateData[name], secretKey);
      }
    }

    // Validate fields based on schema
    for (const field in updateData) {
      const value = updateData[field];
      const path = schemaPaths[field];
      if (!path) continue;

      // 1. Required field
      if (
        path.isRequired &&
        (value === null || value === undefined || value === "")
      ) {
        validationErrors.push(`${field} is required.`);
        continue;
      }

      // 2. Regex validation
      if (path.options?.match) {
        const regex = new RegExp(path.options.match);
        if (!regex.test(value)) {
          validationErrors.push(`${field} format is invalid.`);
        }
      } else {
        // Optional: Smart regex pattern detection
        for (const { keyword, pattern, message } of inferredRegexPatterns) {
          if (field.toLowerCase().includes(keyword) && !pattern.test(value)) {
            validationErrors.push(`${field}: ${message}`);
          }
        }
      }

      // 3. Type check
      if (path.instance === "Number" && isNaN(value)) {
        validationErrors.push(`${field} must be a number.`);
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: validationErrors,
      });
    }

    const result = await DynamicModel.findByIdAndUpdate(
      documentId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found." });
    }

    return res.json({ success: true, message: "Updated succesfully", result });
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
