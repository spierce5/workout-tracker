const mongoose = require("mongoose");
const { User, Workout, Exercise } = require("../models/models");

exports.getWorkouts = (req, res) => {
  const { _id } = req.params;
  if (req.user._id.toString() !== _id) {
    throw new Error("Access denied");
  }

  const { from, to, limit } = req.query;
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (from && isNaN(fromDate)) {
    res.json({ error: "Could not parse from-date.", value: fromDate });
  }

  if (to && isNaN(toDate)) {
    res.json({ error: "Could not parse to-date.", value: toDate });
  }

  Workout.find({ userId: _id })
    .then((workouts) => {
      const log = workouts
        .filter((workout) => {
          if (!from || isNaN(fromDate) || workout.date >= fromDate) {
            if (!to || isNaN(toDate) || workout.date <= toDate) {
              return true;
            }
          }

          return false;
        })
        .filter((workout, idx) => {
          if (!limit || limit > idx) {
            return true;
          }
        })
        .map((workout) => {
          return {
            duration: workout.duration,
            description: workout.description,
            date: new Date(workout.date).toDateString(),
          };
        });

      res.json({
        userId: _id,
        count: log.length,
        log: log,
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.addWorkout = (req, res) => {
  const userId = req.params._id;
  if (req.user._id.toString() !== userId) {
    throw new Error("Access denied");
  }

  let { description, duration, date } = req.body;

  if (!date || date === "") {
    date = new Date();
  } else {
    if (isNaN(new Date(date))) {
      throw new Error(`Invalid date: ${date}`);
    }
  }

  if (description === "" || description === null || !description) {
    throw new Error(
      `Description required. Values: { description: ${description} }, { duration: ${duration} }, { date: ${date} }`
    );
  }

  if (!duration || duration === "" || duration === null) {
    throw new Error("Duration required");
  }

  if (duration && isNaN(duration)) {
    throw new Error(`Duration must be a number. Value provided: ${duration}`);
  }

  const newWorkout = new Workout({
    userId: userId,
    description: description,
    duration: duration,
    date: date,
  });

  newWorkout
    .save()
    .then((workout) => {
      res.json({
        message: "Workout added.",
        workout: {
          description: workout.description,
          duration: parseFloat(workout.duration),
          date: new Date(workout.date).toDateString(),
        },
      });
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.addExercise = async (req, res) => {
  const userId = req.params._id;
  const workout = req.params.workout;
  if (req.user._id.toString() !== userId) {
    throw new Error("Access denied");
  }

  const { type, exercise } = req.body;

  let order = 0;
  await Exercise.find({ workout: workout }).then((exercises) => {
    if (exercises.length > 0) {
      order =
        Math.max.apply(
          Math,
          exercises.flatMap((exercise) => exercise.order)
        ) + 1;
    }
  });
  // const red = query.reduce((exercise) => exercise.order);
  // const max = red.max();

  const exObject = {
    workout: workout,
    type: type,
    order: order,
    ...exercise,
  };

  const newExercise = new Exercise(exObject);

  newExercise
    .save()
    .then((exercise) => {
      res.json({
        message: "Exercise added.",
        exercise: exercise,
      });
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.removeWorkout = async (req, res) => {
  const workout = req.params.workout;
  const userId = req.params._id;

  if (req.user._id.toString() !== userId) {
    throw new Error("Access denied");
  }

  await Workout.findOneAndDelete({ _id: workout })
    .then((deleted) => {
      if (deleted) {
        res.json({
          message: "Workout deleted",
          workout: deleted,
        });
      } else {
        res.status(404).json({
          message: "Workout not found",
        });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.removeExercise = async (req, res) => {
  const workout = req.params.workout;
  const exercise = req.params.exercise;
  const userId = req.params._id;

  if (req.user._id.toString() !== userId) {
    throw new Error("Access denied");
  }

  await Exercise.findOneAndDelete({ workout: workout, _id: exercise })
    .then((deleted) => {
      if (deleted) {
        res.json({
          message: "Exercise deleted",
          exercise: deleted,
        });

        consolidateOrder(workout);
      } else {
        res.status(404).json({
          message: "Exercise not found",
        });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

const consolidateOrder = (workout) => {
  Exercise.find({ workout: workout }).then((exercises) => {
    exercises.sort((a, b) => a.order - b.order);
    Exercise.bulkWrite(
      exercises.map((exercise, idx) => {
        return {
          updateOne: {
            filter: { _id: exercise._id },
            update: { order: idx },
          },
        };
      })
    );
  });
};
