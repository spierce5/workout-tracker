const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Token } = require("../models/models");
const crypto = require("crypto");
const sendEmail = require("../utils/email/sendEmail");

const bcryptSalt = process.env.BCRYPT_SALT;

exports.signup = (req, res) => {
  const user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, Number(bcryptSalt)),
  });

  user
    .save()
    .then((user) => {
      res.status(200).send({
        message: "User Registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
      return;
    });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Username or password is incorrect",
        });
      }

      //comparing passwords
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      // checking if password was valid and send response accordingly
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Username or password is incorrect",
        });
      }
      //signing token with user id
      let token = jwt.sign(
        {
          id: user.id,
        },
        process.env.API_SECRET,
        {
          expiresIn: 86400,
        }
      );

      //responding to client request with user profile success message and  access token .
      res.status(200).send({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
        },
        message: "Login successful",
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
      return;
    });
};

exports.deleteUser = async (req, res) => {
  const { _id } = req.params;
  if (req.user._id.toString() !== _id) {
    throw new Error("Access denied");
  }

  let passwordIsValid = bcrypt.compareSync(
    req.body.password,
    req.user.password
  );
  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!",
    });
  }

  await User.findOneAndDelete({ _id: req.user._id })
    .then((user) => {
      res.json({
        message: "User deleted",
        user: {
          id: user._id,
          username: user.username,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

//TODO:: add password reset request and password reset functionality
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  await User.findOne({ email: email }).then(async (user) => {
    if (user) {
      let token = await Token.findOne({ userId: user._id });
      if (token) await token.deleteOne();

      let resetToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

      await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      }).save();

      const link = `${req.headers.host}/api/password-reset?token=${resetToken}&email=${user.email}&userId=${user._id}`;

      sendEmail(
        user.email,
        "Password Reset Request",
        {
          name: user.name,
          link: link,
        },
        "./template/requestResetPassword.handlebars"
      );
      res.status(202).json({
        message:
          "Request received. If the account exists you will receive an email at your registered address.",
      });
    } else {
      res.status(202).json({
        message:
          "Request received. If the account exists you will receive an email at your registered address.",
      });
    }
  });
};

exports.resetPassword = async (req, res) => {
  const { password, passwordConfirm } = req.body;
  const { email, userId } = req.query;
  const hash = bcrypt.hashSync(password, Number(bcryptSalt));

  if (password !== passwordConfirm) {
    res
      .status(400)
      .json({ error: "Password and confirmation password do not match" });

    return;
  }

  await User.findOneAndUpdate({ email, email }, { $set: { password: hash } })
    .then(async (user) => {
      Token.findOneAndDelete({ userId: userId })
        .then((token) => {
          console.log(`Token deleted: ${token.token}`);
        })
        .catch((err) => console.log(err));
      res.json({
        message: "Password reset successfully",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
