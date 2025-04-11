import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: String,
  state: String,
  data: Object,
});

const UserSession = mongoose.model("UserSession", sessionSchema);
export default UserSession;