"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");

const { isLoggedIn } = require("../middleware/user");
const { registerUser, loginJWT } = require("../services/http/user");

require("../configs/passport-jwt")(passport);
require("../configs/passport-local")(passport);

router.route("/register")
    .post(registerUser);

router.route("/logout")
    .get(isLoggedIn, (req, res) => {
        req.session.destroy(() => {
            res.json({ message: "Successfully logged out" });
        });
    });

router.route("/login/jwt")
    .post(loginJWT);

router.route("/login")
    .post(passport.authenticate("local"), (req, res) => {
        const { user } = req;
        return res.status(200).json({
            success: true,
            user
        });
    });

router.route("/isAuthenticated")
    .get(isLoggedIn, (req, res) => {
        res.status(200).json({
            id: req.user.id,
            user: req.user.username
        });
    });

module.exports = router;
