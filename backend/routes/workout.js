const express = require("express");
const { verifyToken } = require("../middleware/authJWT");
const {
  addWorkout,
  addExercise,
  getWorkouts,
  removeWorkout,
  removeExercise,
} = require("../controllers/workout.controller.js");
const router = express.Router();

router.get("/api/users/:_id/logs", verifyToken, getWorkouts);

router.post("/api/users/:_id/workouts", verifyToken, addWorkout);

router.post(
  "/api/users/:_id/workouts/:workout/exercises",
  verifyToken,
  addExercise
);

router.delete("/api/users/:_id/workouts/:workout", verifyToken, removeWorkout);

router.delete(
  "/api/users/:_id/workouts/:workout/exercises/:exercise",
  verifyToken,
  removeExercise
);

module.exports = router;
