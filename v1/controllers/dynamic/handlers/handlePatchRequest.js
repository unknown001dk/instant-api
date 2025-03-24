import mongoose from "mongoose";

export const handlePatchRequest = async ({ req, res, DynamicModel, documentId }) => {
  try {
    const schemaPaths = DynamicModel.schema.paths;
    const validationErrors = [];

    for (const field in req.body) {
      const path = schemaPaths[field];
      const value = req.body[field];

      if (!path) continue; // Skip fields not in schema

      // 1. Required (only check if field is being updated)
      if (path.isRequired && (value === undefined || value === "")) {
        validationErrors.push(`${field} is required.`);
      }

      // 2. Match pattern (regex validation)
      if (path.options?.match && typeof value === "string") {
        const regex = path.options.match instanceof RegExp
          ? path.options.match
          : new RegExp(path.options.match);
        if (!regex.test(value)) {
          validationErrors.push(`${field} is invalid format.`);
        }
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: validationErrors,
      });
    }

    const result = await DynamicModel.findByIdAndUpdate(documentId, req.body, {
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
