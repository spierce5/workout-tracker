use("test");

// Insert a few documents into the sales collection.
const workouts = db.getCollection("workouts");
// workouts.remove({});
// workouts.find({ _id: ObjectId("64cb0a8c460c8a1d56f47abc") });
// workouts.find({ userId: "64bded60971cb5acb3f72185" });

const users = db.getCollection("users");
// users.remove({});

// users.find({ email: "sam.pierce76@gmail.com" });

const exercises = db.getCollection("exercises");

// exercises.remove({});

// exercises.find({ workout: "64cb0a8c460c8a1d56f47abc" });

const tokens = db.getCollection("tokens");

tokens.find({});
