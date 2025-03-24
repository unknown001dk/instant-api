import mongoose from "mongoose";

export const handlePutRequest = async ({ req, res, DynamicModel, documentId }) => {
  try {
    const schemaPaths = DynamicModel.schema.paths;
    const updateData = req.body;
    const validationErrors = [];

    // Validate fields based on schema
    for (const field in updateData) {
      const value = updateData[field];
      const path = schemaPaths[field];

      if (!path) continue; // Ignore unknown fields

      // 1. Required field (only if user is updating it)
      if (path.isRequired && (value === null || value === undefined || value === '')) {
        validationErrors.push(`${field} is required.`);
        continue;
      }

      // 2. Regex validation (match)
      if (path.options?.match) {
        const regex = new RegExp(path.options.match);
        if (!regex.test(value)) {
          validationErrors.push(`${field} format is invalid.`);
        }
      }

      // 3. Type check (optional)
      if (path.instance === "Number" && isNaN(value)) {
        validationErrors.push(`${field} must be a number.`);
      }

      // You can add minLength, maxLength, etc., here if needed
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
      runValidators: true, // Let Mongoose also validate unique and schema rules
    });

    if (!result) {
      return res.status(404).json({ success: false, message: "Document not found." });
    }

    return res.json({ success: true, result });

  } catch (error) {
    // Handle MongoDB duplicate key error (unique constraint)
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
