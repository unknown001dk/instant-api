import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  activityDescription: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    Token: {
      type: String,
      default: null,
    },
    activities: [activitySchema], // Embedding activities as an array of subdocuments
    profilePicture: {
      type: String,
      default: '',
    },
   
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
