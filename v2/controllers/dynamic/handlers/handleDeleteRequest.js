import mongoose from "mongoose";

/**
 * Handles deletion of a document by its ID.
 * Includes validation, error reporting, and structured response.
 *
 * @param {Object} params
 * @param {Object} params.res - Express response object
 * @param {Object} params.DynamicModel - Mongoose model to operate on
 * @param {string} params.documentId - Document ID to be deleted
 */
export const handleDeleteRequest = async ({ res, DynamicModel, documentId }) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID format.",
      });
    }

    // Attempt to find and delete the document
    const deletedDocument = await DynamicModel.findByIdAndDelete(documentId);

    // Handle not found
    if (!deletedDocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found or already deleted.",
      });
    }

    // Successful deletion
    return res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
      deletedId: documentId,
    });
  } catch (error) {
    // Unexpected server error
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete the document due to server error.",
    });
  }
};
