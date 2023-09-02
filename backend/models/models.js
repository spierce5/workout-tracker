const mongoose = require("mongoose");

const units = {
  weight: ["kg", "lb"],
  time: ["sec", "min", "hr"],
  distance: ["mi", "km", "yd", "m", "ft"],
  height: ["cm", "in", "ft", "m"],
};

const types = ["Run", "Lift"];

const options = {
  discriminatorKey: "type",
};

/*
 * ExerciseSchema is the base schema and the discriminator key is type. When a new entry is posted,
 * the type field will determine which extended schema will be used.
 *
 */

const ExerciseSchema = mongoose.Schema(
  {
    workout: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: types,
      required: true,
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  options
);

const DistanceSchema = mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: units.distance,
      required: true,
    },
  },
  { _id: false }
);

const TimeSchema = mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      enum: units.time,
      required: true,
    },
  },
  { _id: false }
);

const RunSchema = new mongoose.Schema(
  {
    duration: TimeSchema,
    startPos: String,
    endPos: String,
    distance: DistanceSchema,
  },
  options
);

const WeightSchema = mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: units.weight,
      required: true,
    },
  },
  { _id: false }
);

const SetSchema = mongoose.Schema(
  {
    order: Number,
    weight: WeightSchema,
    reps: Number,
    rest: TimeSchema,
  },
  { _id: false }
);

const LiftSchema = mongoose.Schema(
  {
    sets: {
      type: [SetSchema],
      required: true,
    },
  },
  options
);

const Exercise = mongoose.model("Exercise", ExerciseSchema);
const Lift = Exercise.discriminator("Lift", LiftSchema);
const Run = Exercise.discriminator("Run", RunSchema);

/*
 * TODO:: add startTime, endTime. Make startTime default to current time if not entered. On backend, calc endTime if
 * duration is given and calc duratino if endTime is given.
 */

const WorkoutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username is not available."],
    required: [true, "Username not provided."],
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s]+$/.test(v);
      },
      message: "{VALUE} is not a valid username.",
    },
  },
  name: {
    type: String,
    required: [true, "Name not provided "],
  },
  email: {
    type: String,
    unique: [true, "Email already exists."],
    lowercase: true,
    trim: true,
    required: [true, "Email not provided."],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "{VALUE} is not a valid email.",
    },
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 900,
  },
});

const HeightSchema = new mongoose.Schema(
  {
    centimeters: {
      type: Number,
      required: true,
      min: 0,
    },
    convertToUnit: {
      type: String,
      enum: units.height,
      required: true,
    },
  },
  { _id: false }
);

const AssessmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  weight: WeightSchema,
  height: HeightSchema,
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: String,
});

const User = mongoose.model("User", UserSchema);

const Token = mongoose.model("Token", TokenSchema);

const Workout = mongoose.model("Workout", WorkoutSchema);

const Assessment = mongoose.model("Assessment", AssessmentSchema);

module.exports = { User, Token, Workout, Exercise, Assessment };
