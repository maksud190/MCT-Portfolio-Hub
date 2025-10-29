

// import express from "express";
// import multer from "multer";
// import {
//   uploadProject,
//   getAllProjects,
//   getUserProjects
// } from "../controllers/projectController.js";

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// // ✅ Upload project
// router.post("/upload", upload.single("file"), uploadProject);

// // ✅ All projects
// router.get("/", getAllProjects);

// // ✅ Specific user's projects
// router.get("/user/:userId", getUserProjects);

// export default router;



import express from "express";
import multer from "multer";
import {
  uploadProject,
  getAllProjects,
  getUserProjects,
  getProjectById // 🔥 New route
} from "../controllers/projectController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Upload project with multiple images
router.post("/upload", upload.array("files", 5), uploadProject); // 🔥 .array() for multiple files, max 5

// ✅ All projects
router.get("/", getAllProjects);

// ✅ Specific user's projects
router.get("/user/:userId", getUserProjects);

// 🔥 Get single project by ID
router.get("/:projectId", getProjectById);

export default router;