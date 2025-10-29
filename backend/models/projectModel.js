// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   title: { type: String, required: true },
//   description: String,
//   category: String,
//   imageUrl: String,
//   likes: { type: Number, default: 0 },
//   comments: [{ user: String, text: String }]
// }, { timestamps: true });

// export default mongoose.model("Project", projectSchema);



import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  description: String,
  category: String,
  thumbnail: { type: String, required: true }, // 🔥 Thumbnail image
  images: [{ type: String }], // 🔥 All images array
  likes: { type: Number, default: 0 },
  comments: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);