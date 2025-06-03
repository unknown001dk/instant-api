import mongoose from "mongoose";

const schemaModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    schemaDefinition: {
      type: Array,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    realtimeEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Schema = mongoose.model("Schema", schemaModel);

export default Schema;
