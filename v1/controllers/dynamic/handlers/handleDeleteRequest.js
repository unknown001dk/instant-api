import mongoose from "mongoose";
export const handleDeleteRequest = async ({ res, DynamicModel, documentId }) => {
  try {
    const result = await DynamicModel.findByIdAndDelete(documentId);

    if (!result) {
      return res.status(404).json({ success: false, message: "Document not found." });
    }

    return res.json({ success: true, message: "Document deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete document.",
    });
  }
};
