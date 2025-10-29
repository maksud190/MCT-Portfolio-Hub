

// import { likeProject } from "../controllers/projectController.js";
// import express from "express";
// import multer from "multer";
// import {
//   uploadProject,
//   getAllProjects,
//   getUserProjects,
//   getProjectById // 🔥 New route
// } from "../controllers/projectController.js";

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// // ✅ Upload project with multiple images
// router.post("/upload", upload.array("files", 5), uploadProject); // 🔥 .array() for multiple files, max 5

// // ✅ All projects
// router.get("/", getAllProjects);

// // ✅ Specific user's projects
// router.get("/user/:userId", getUserProjects);

// // 🔥 Get single project by ID
// router.get("/:projectId", getProjectById);



// // ✅ Like route
// router.post("/:projectId/like", likeProject);

// export default router;



import express from "express";
import multer from "multer";
import {
  uploadProject,
  getAllProjects,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  likeProject,
  checkLikeStatus // 🔥 New import
} from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // 🔥 Import করা

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Upload project with multiple images
router.post("/upload", upload.array("files", 5), uploadProject);

// ✅ All projects
router.get("/", getAllProjects);

// ✅ Specific user's projects
router.get("/user/:userId", getUserProjects);

// ✅ Get single project by ID
router.get("/:projectId", getProjectById);

// 🔥 Update project
router.put("/:projectId", upload.array("files", 5), updateProject);

// 🔥 Delete project
router.delete("/:projectId", deleteProject);

// 🔥 Like/Unlike route - authMiddleware দিয়ে protect করা
router.post("/:projectId/like", authMiddleware, likeProject);

// 🔥 Check like status - optional auth (user না থাকলেও কাজ করবে)
router.get("/:projectId/like-status", (req, res, next) => {
  // Token optional - থাকলে decode করবে, না থাকলে skip করবে
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    return authMiddleware(req, res, next);
  }
  req.userId = null;
  next();
}, checkLikeStatus);

export default router;