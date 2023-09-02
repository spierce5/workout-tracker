const jwt = require("jsonwebtoken");
const { User, Token } = require("../models/models");
const bcrypt = require("bcrypt");

const verifyToken = (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    try {
      jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.API_SECRET,
        function (err, decode) {
          if (err) req.user = undefined;
          User.findOne({
            _id: decode.id,
          })
            .then((user) => {
              req.user = user;
              next();
            })
            .catch((err) => {
              res.status(500).send({
                message: err,
              });
            });
        }
      );
    } catch {
      throw new Error("Authentication failed");
    }
  } else {
    req.user = undefined;
    throw new Error("Authentication failed");
    next();
  }
};

const verifyResetToken = async (req, res, next) => {
  const { userId } = req.query;
  await Token.findOne({ userId })
    .then(async (passwordResetToken) => {
      if (!passwordResetToken) {
        res
          .status(404)
          .json({ error: "Invalid or expired password reset token" });
      } else {
        const isValid = await bcrypt.compare(
          req.query.token,
          passwordResetToken.token
        );

        if (!isValid) {
          res
            .status(404)
            .json({ error: "Invalid or expired password reset token" });
        } else {
          next();
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(404)
        .json({ error: "Invalid or expired password reset token" });
    });
};

module.exports = { verifyToken, verifyResetToken };
