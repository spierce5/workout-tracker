const app = require("../../index");
var bodyParser = require("body-parser");
const request = require("supertest");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const mongoose = require("mongoose");
const { User, Workout } = require("../../models/models");

let testUser1, testUser2;

beforeAll(async () => {
  const password = "TeSt123@";
  const res1 = await request(app)
    .post("/api/register")
    .send({
      username: `test${Date.now()}`,
      name: "test",
      email: `test${Date.now()}@test123.com`,
      password: password,
    })
    .set("Accept", "application/json");
  const res2 = await request(app)
    .post("/api/register")
    .send({
      username: `test${Date.now()}`,
      name: "test",
      email: `test${Date.now()}@test123.com`,
      password: password,
    })
    .set("Accept", "application/json");

  testUser1 = res1.body.user;
  testUser2 = res2.body.user;
  testUser1.password = password;
  testUser2.password = password;

  const res3 = await request(app)
    .post("/api/login")
    .send({
      username: testUser1.username,
      password: testUser1.password,
    })
    .set("Accept", "application/json");
  const res4 = await request(app)
    .post("/api/login")
    .send({
      username: testUser2.username,
      password: testUser2.password,
    })
    .set("Accept", "application/json");

  testUser1.token = `JWT ${res3.body.accessToken}`;
  testUser2.token = `JWT ${res4.body.accessToken}`;
});

/*
 * Write tests for bad registration (username errors, password errors, etc.)
 */

describe("POST /api/register", () => {
  it("should create a new user and return the id, username, and email", async () => {
    const username = `sam${Date.now()}`;
    const email = `sam${Date.now()}@sam.com`;

    const res = await request(app)
      .post("/api/register")
      .send({
        username: username,
        email: email,
        password: "tEstPaSSw0rd",
        name: "sam",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("User Registered successfully");
    expect(res.body.user).toHaveProperty("username");
    expect(res.body.user.username).toBe(username);
    expect(res.body.user).toHaveProperty("email");
    expect(res.body.user.email).toBe(email);
    expect(res.body.user).toHaveProperty("id");
  });
});

/*
 * Write tests for bad login.
 */

describe("POST /api/login", () => {
  it("should log in the user and return an access token", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: testUser1.username,
        password: testUser1.password,
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Login successful");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("username");
    expect(res.body.user.username).toBe(testUser1.username);
    expect(res.body).toHaveProperty("accessToken");
  });
});

describe("POST /api/users/:_id/workouts", () => {
  it("should return the workout fields and a success message", async () => {
    const res = await request(app)
      .post(`/api/users/${testUser1.id}/workouts`)
      .send({
        description: `Test ${Date.now()}`,
        duration: 5,
        date: new Date(),
      })
      .set({
        Accept: "application/json",
        Authorization: testUser1.token,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Workout added.");
    expect(res.body).toHaveProperty("workout");
    expect(res.body.workout).toHaveProperty("description");
    expect(res.body.workout).toHaveProperty("date");
    expect(res.body.workout).toHaveProperty("duration");
  });

  it("should return an error when date is not valid", async () => {
    const res = await request(app)
      .post(`/api/users/${testUser1.id}/workouts`)
      .send({
        description: "Test without date",
        duration: 10,
        date: "aaaa",
      })
      .set({
        Accept: "application/json",
        Authorization: testUser1.token,
      });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("current date should be submitted when no date is given", async () => {
    const res = await request(app)
      .post(`/api/users/${testUser1.id}/workouts`)
      .send({
        description: "Test without date",
        duration: 10,
      })
      .set({
        Accept: "application/json",
        Authorization: testUser1.token,
      });
    expect(res.body.workout.date).toEqual(new Date().toDateString());
  });

  it("should return an error when description is missing", async () => {
    const res = await request(app)
      .post(`/api/users/${testUser1.id}/workouts`)
      .send({
        duration: 10,
        date: new Date(),
      })
      .set({
        Accept: "application/json",
        Authorization: testUser1.token,
      });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("should return an error when duration is missing", async () => {
    const res = await request(app)
      .post(`/api/users/${testUser2.id}/workouts`)
      .send({
        description: "missing duration",
        date: new Date(),
      })
      .set({
        Accept: "application/json",
        Authorization: testUser2.token,
      });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("should return an error when duration is not a number", async () => {
    const res = await request(app)
      .post(`/api/users/${testUser2.id}/workouts`)
      .send({
        duration: "abc",
        date: new Date(),
      })
      .set({
        Accept: "application/json",
        Authorization: testUser2.token,
      });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});

describe("POST /api/users/:_id/workouts/:workout/exercises", () => {
  let workout;
  beforeAll(async () => {
    workout = await Workout.findOne({ userId: testUser1.id });
  });

  it("should create a new lift linked to the workout", async () => {
    const res = await request(app)
      .post(`/api/users/${testUser1.id}/workouts/${workout._id}/exercises`)
      .send({
        type: "Lift",
        exercise: {
          sets: [
            {
              order: 1,
              weight: {
                value: 100,
                unit: "Lbs",
              },
              reps: 9,
              rest: {
                value: 30,
                unit: "Sec",
              },
            },
            {
              order: 2,
              weight: {
                value: 110,
                unit: "Lbs",
              },
              reps: 8,
              rest: {
                value: 30,
                unit: "Sec",
              },
            },
          ],
        },
      })
      .set({
        Accept: "application/json",
        Authorization: testUser1.token,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Exercise added.");
    expect(res.body).toHaveProperty("exercise");
    expect(res.body.exercise).toHaveProperty("type");
    expect(res.body.exercise.type).toBe("Lift");
    expect(res.body.exercise).toHaveProperty("sets");
    expect(res.body.exercise.sets).toBeInstanceOf(Array);
    res.body.exercise.sets.forEach((set) => {
      expect(set).toHaveProperty("order");
      expect(set).toHaveProperty("weight");
      expect(set).toHaveProperty("rest");
      expect(set).toHaveProperty("reps");
      expect(set.weight).toHaveProperty("value");
      expect(set.weight).toHaveProperty("unit");
      expect(set.rest).toHaveProperty("value");
      expect(set.rest).toHaveProperty("unit");
      expect(set.weight.unit).toBe("Lbs");
      expect(set.rest.unit).toBe("Sec");
      expect(set.weight.value).toEqual(expect.any(Number));
      expect(set.rest.value).toEqual(expect.any(Number));
      expect(set.reps).toEqual(expect.any(Number));
      expect(set.order).toEqual(expect.any(Number));
    });
  });

  it("should create a new lift with no run properties", async () => {
    const res = await request(app)
      .post(`/api/users/${testUser1.id}/workouts/${workout._id}/exercises`)
      .send({
        type: "Lift",
        exercise: {
          duration: {
            value: 20,
            unit: "Min",
          },
          distance: {
            value: 1,
            unit: "Mile",
          },
        },
      })
      .set({
        Accept: "application/json",
        Authorization: testUser1.token,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Exercise added.");
    expect(res.body).toHaveProperty("exercise");
    expect(res.body.exercise).toHaveProperty("type");
    expect(res.body.exercise.type).toBe("Lift");
    expect(res.body.exercise).not.toHaveProperty("duration");
    expect(res.body.exercise).not.toHaveProperty("distance");
    expect(res.body.exercise).toHaveProperty("sets");
  });

  it("should create a new run linked to the workout", async () => {
    const res = await request(app)
      .post(`/api/users/${testUser1.id}/workouts/${workout._id}/exercises`)
      .send({
        type: "Run",
        exercise: {
          duration: {
            value: 20,
            unit: "Min",
          },
          distance: {
            value: 1,
            unit: "Mile",
          },
        },
      })
      .set({
        Accept: "application/json",
        Authorization: testUser1.token,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Exercise added.");
    expect(res.body).toHaveProperty("exercise");
    expect(res.body.exercise).toHaveProperty("type");
    expect(res.body.exercise.type).toBe("Run");
    expect(res.body.exercise).toHaveProperty("duration");
    expect(res.body.exercise).toHaveProperty("distance");
    expect(res.body.exercise.duration).toHaveProperty("value");
    expect(res.body.exercise.duration).toHaveProperty("unit");
    expect(res.body.exercise.distance).toHaveProperty("value");
    expect(res.body.exercise.distance).toHaveProperty("unit");
    expect(res.body.exercise.duration.value).toBe(20);
    expect(res.body.exercise.duration.unit).toBe("Min");
    expect(res.body.exercise.distance.value).toBe(1);
    expect(res.body.exercise.distance.unit).toBe("Mile");
  });

  it("should create a new run with no lift properties", async () => {
    const res = await request(app)
      .post(`/api/users/${testUser1.id}/workouts/${workout._id}/exercises`)
      .send({
        type: "Run",
        exercise: {
          sets: [
            {
              order: 1,
              weight: {
                value: 100,
                unit: "Lbs",
              },
              reps: 9,
              rest: {
                value: 30,
                unit: "Sec",
              },
            },
            {
              order: 2,
              weight: {
                value: 110,
                unit: "Lbs",
              },
              reps: 8,
              rest: {
                value: 30,
                unit: "Sec",
              },
            },
          ],
        },
      })
      .set({
        Accept: "application/json",
        Authorization: testUser1.token,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Exercise added.");
    expect(res.body).toHaveProperty("exercise");
    expect(res.body.exercise).toHaveProperty("type");
    expect(res.body.exercise.type).toBe("Run");
    expect(res.body.exercise).not.toHaveProperty("sets");
  });
});

describe("GET /api/users/:_id/logs", () => {
  it("returns a user object with a count property representing the number of workouts that belong to that user.", async () => {
    const res = await request(app).get(`/api/users/${testUser1.id}/logs`).set({
      Accept: "application/json",
      Authorization: testUser1.token,
    });
    expect(res.body).toHaveProperty("log");
    expect(res.body).toHaveProperty("count");
    expect(res.body.log).toBeInstanceOf(Array);
    expect(res.body.count).toBeGreaterThan(0);
  });

  it("each item in the log array that is returned is an object that should have a description, duration, and date properties.", async () => {
    const res = await request(app).get(`/api/users/${testUser2.id}/logs`).set({
      Accept: "application/json",
      Authorization: testUser2.token,
    });
    res.body.log.forEach((workout) => {
      expect(workout).toHaveProperty("description");
      expect(workout).toHaveProperty("duration");
      expect(workout).toHaveProperty("date");
    });
  });
});
