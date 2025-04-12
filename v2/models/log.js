import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  endpoint: String,
  method: String,
  status: Number,
  ip: String,
  createdAt: { type: Date, default: Date.now() },
},{
  timestamps: true
})

const Logs = mongoose.model("Log", logSchema);

export default Logs;