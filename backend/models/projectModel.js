import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  description: String,
  category: String,
  imageUrl: String,
  likes: { type: Number, default: 0 },
  comments: [{ user: String, text: String }]
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
