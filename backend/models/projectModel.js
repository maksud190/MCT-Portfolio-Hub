

// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     title: { type: String, required: true },
//     description: String,
//     category: String,
//     thumbnail: { type: String, required: true },
//     images: [{ type: String }],
//     likes: { type: Number, default: 0 },
//     likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ New field
//     comments: [
//       {
//         user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         text: String,
//         createdAt: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Project", projectSchema);


import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: String,
    category: String,
    thumbnail: { type: String, required: true },
    images: [{ type: String }],
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 }, // 🔥 View count field
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // 🔥 createdAt and updatedAt automatically added
);

export default mongoose.model("Project", projectSchema);