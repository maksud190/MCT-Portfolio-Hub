
// import Project from "../models/projectModel.js";
// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config();
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ Upload new project with multiple images
// export const uploadProject = async (req, res) => {
//   try {
//     const files = req.files; // 🔥 Multiple files
//     const { title, description, category, userId } = req.body;

//     if (!files || files.length === 0) {
//       return res.status(400).json({ message: "No files uploaded" });
//     }

//     // 🔥 Upload all images to Cloudinary
//     const uploadPromises = files.map((file) =>
//       cloudinary.uploader.upload(file.path)
//     );

//     const uploadResults = await Promise.all(uploadPromises);
    
//     // 🔥 Extract image URLs
//     const imageUrls = uploadResults.map((result) => result.secure_url);

//     // 🔥 First image is thumbnail
//     const project = await Project.create({
//       userId,
//       title,
//       description,
//       category,
//       thumbnail: imageUrls[0], // First image as thumbnail
//       images: imageUrls, // All images
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

// // ✅ Get user projects
// export const getUserProjects = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const projects = await Project.find({ userId }).sort({ createdAt: -1 });
//     res.json(projects);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔥 Get single project with all images
// export const getProjectById = async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const project = await Project.findById(projectId).populate("userId", "username email avatar");
    
//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }
    
//     res.json(project);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // ✅ Like a project
// export const likeProject = async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const project = await Project.findById(projectId);

//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     project.likes = (project.likes || 0) + 1;
//     await project.save();

//     res.json({ message: "Project liked!", likes: project.likes });
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

// ... existing functions (uploadProject, getAllProjects, getUserProjects, getProjectById) ...

// 🔥 Like/Unlike a project - Updated with user tracking
export const likeProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId; // 🔥 authMiddleware থেকে আসবে

    if (!userId) {
      return res.status(401).json({ message: "Please login to like projects" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔥 Check করা user already like দিয়েছে কিনা
    const alreadyLiked = project.likedBy.includes(userId);

    if (alreadyLiked) {
      // 🔥 Unlike করা
      project.likedBy = project.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      project.likes = Math.max(0, (project.likes || 0) - 1);
      await project.save();

      return res.json({ 
        message: "Project unliked", 
        likes: project.likes,
        isLiked: false 
      });
    } else {
      // 🔥 Like করা
      project.likedBy.push(userId);
      project.likes = (project.likes || 0) + 1;
      await project.save();

      return res.json({ 
        message: "Project liked!", 
        likes: project.likes,
        isLiked: true 
      });
    }
  } catch (err) {
    console.error("❌ Like error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Check if user has liked a project
export const checkLikeStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.json({ isLiked: false });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isLiked = project.likedBy.includes(userId);
    res.json({ isLiked, likes: project.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Update project
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const files = req.files;
    const { title, description, category, existingImages } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let remainingImages = [];
    try {
      remainingImages = JSON.parse(existingImages || "[]");
    } catch (err) {
      remainingImages = [];
    }

    let newImageUrls = [];
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        cloudinary.uploader.upload(file.path)
      );
      const uploadResults = await Promise.all(uploadPromises);
      newImageUrls = uploadResults.map((result) => result.secure_url);
    }

    const allImages = [...remainingImages, ...newImageUrls];

    if (allImages.length === 0) {
      return res.status(400).json({ message: "Project must have at least one image" });
    }

    project.title = title;
    project.description = description;
    project.category = category;
    project.thumbnail = allImages[0];
    project.images = allImages;

    await project.save();

    res.json({ message: "Project updated successfully", project });
  } catch (err) {
    console.error("❌ Update error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Delete project
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Project.findByIdAndDelete(projectId);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Upload new project with multiple images
export const uploadProject = async (req, res) => {
  try {
    const files = req.files;
    const { title, description, category, userId } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path)
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const project = await Project.create({
      userId,
      title,
      description,
      category,
      thumbnail: imageUrls[0],
      images: imageUrls,
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
    const projects = await Project.find()
      .populate("userId", "username email avatar")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("❌ Get all projects error:", err.message);
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
    console.error("❌ Get user projects error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Get single project with all images
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId)
      .populate("userId", "username email avatar");
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  } catch (err) {
    console.error("❌ Get project by ID error:", err.message);
    res.status(500).json({ message: err.message });
  }
};