import mongoose from "mongoose";

const mongoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    atlasURI: {
      type: String,
      required: true,
    },
    localURI: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MongoUri = mongoose.model("MongoUri", mongoSchema);
export default MongoUri;
