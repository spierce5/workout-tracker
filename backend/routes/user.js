const express = require("express"),
  router = express.Router(),
  {
    signup,
    signin,
    deleteUser,
    requestPasswordReset,
    resetPassword,
  } = require("../controllers/auth.controller.js");
const { verifyToken, verifyResetToken } = require("../middleware/authJWT");

router.post("/api/register", signup, function (req, res) {});

router.post("/api/login", signin, function (req, res) {});

router.delete("/api/users/:_id/", verifyToken, deleteUser);

router.post("/api/password-reset/request", requestPasswordReset);

router.get("/api/password-reset", verifyResetToken, (req, res) => {
  res.render("passwordReset.ejs", {
    email: req.query.email,
    token: req.query.token,
    userId: req.query.userId,
  });
});

router.post("/api/password-reset", verifyResetToken, resetPassword);

module.exports = router;
