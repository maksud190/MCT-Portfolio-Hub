
// import Project from "../models/projectModel.js";
// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config();
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ Upload new project
// export const uploadProject = async (req, res) => {
//   try {
//     const file = req.file;
//     const { title, description, category, userId } = req.body;

//     if (!file) return res.status(400).json({ message: "No file uploaded" });

//     const upload = await cloudinary.uploader.upload(file.path);
//     const project = await Project.create({
//       userId,
//       title,
//       description,
//       category,
//       imageUrl: upload.secure_url,
//     });

//     res.json({ message: "Project uploaded", project });
//   } catch (err) {
//     console.error("❌ Upload error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Get all projects
// export const getAllProjects = async (req, res) => {
//   try {
//     const projects = await Project.find().populate("userId", "username email");
//     res.json(projects);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// export const getUserProjects = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const projects = await Project.find({ userId }).sort({ createdAt: -1 });
//     res.json(projects);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




import Project from "../models/projectModel.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload new project with multiple images
export const uploadProject = async (req, res) => {
  try {
    const files = req.files; // 🔥 Multiple files
    const { title, description, category, userId } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // 🔥 Upload all images to Cloudinary
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path)
    );

    const uploadResults = await Promise.all(uploadPromises);
    
    // 🔥 Extract image URLs
    const imageUrls = uploadResults.map((result) => result.secure_url);

    // 🔥 First image is thumbnail
    const project = await Project.create({
      userId,
      title,
      description,
      category,
      thumbnail: imageUrls[0], // First image as thumbnail
      images: imageUrls, // All images
    });

    res.json({ message: "Project uploaded", project });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("userId", "username email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get user projects
export const getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Get single project with all images
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate("userId", "username email avatar");
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};