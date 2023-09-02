const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authJWT");
const {
  getAssessments,
  addAssessment,
  deleteAssessment,
  updateAssessment,
} = require("../controllers/assessment.controller.js");

router.post("/api/users/:userId/assessments", verifyToken, addAssessment);

router.get("/api/users/:userId/assessments", verifyToken, getAssessments);

router.put(
  "/api/users/:userId/assessments/:assessmentId",
  verifyToken,
  updateAssessment
);

router.delete(
  "/api/users/:userId/assessments/:assessmentId",
  verifyToken,
  deleteAssessment
);

module.exports = router;
