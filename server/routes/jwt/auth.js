"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");

const { registerUser, loginJWT } = require("../../services/http/user");

require("../../configs/passport-jwt")(passport);

router.route("/register")
    .post(registerUser);

router.route("/login/jwt")
    .post(loginJWT);

module.exports = router;
