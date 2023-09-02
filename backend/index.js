const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");
const assessmentRoutes = require("./routes/assessment");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(userRoutes);
app.use(workoutRoutes);
app.use(assessmentRoutes);
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const start = async () => {
  try {
    await mongoose.connect(process.env.DBCONN);
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();

module.exports = app;
