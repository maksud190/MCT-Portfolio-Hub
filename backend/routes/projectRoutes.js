// import express from "express";
// import multer from "multer";
// import { uploadProject, getAllProjects } from "../controllers/projectController.js";


// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// router.post("/upload", upload.single("file"), uploadProject);
// router.get("/", getAllProjects);


// export default router;


// import express from "express";
// import multer from "multer";
// import {
//   uploadProject,
//   getAllProjects,
  
// } from "../controllers/projectController.js";

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// // ✅ Upload new project
// router.post("/upload", upload.single("file"), uploadProject);

// // ✅ Get all projects
// router.get("/", getAllProjects);

// // ✅ Get projects for one specific user
// router.get("/user/:userId", getAllProjects);

// export default router;


import express from "express";
import multer from "multer";
import {
  uploadProject,
  getAllProjects,
  getUserProjects
} from "../controllers/projectController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Upload project
router.post("/upload", upload.single("file"), uploadProject);

// ✅ All projects
router.get("/", getAllProjects);

// ✅ Specific user's projects
router.get("/user/:userId", getUserProjects);

export default router;
