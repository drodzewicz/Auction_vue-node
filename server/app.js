"use strict";
require("dotenv").config();
// const http = require("http");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const express = require("express");
const socketIO = require("socket.io");
const session = require("express-session");
const passport = require("passport");
const MongoStrore = require("connect-mongo")(session);
const errorHandler = require("errorhandler");
const passportSocketIo = require("passport.socketio");
const cookieParser = require("cookie-parser");
const mongoose = require("./configs/mongoose");

const PORT = process.env.SERVER_PORT || 3000;
const SECRET = process.env.SECRET || "$uP3Rr $3cret C0de 4 flN@l Pr0j3<T";
const ENVIROMENT = process.env.NODE_ENV || "development";
const SESSION_KEY = process.env.SESSION_KEY || "express.sid";

const app = express();

// const server = http.createServer(app);
const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, "https", "my.key")),
    cert: fs.readFileSync(path.join(__dirname, "https", "my.crt"))
}, app);
const io = socketIO(server);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// session store
const sessionStore = new MongoStrore({
    mongooseConnection: mongoose.connection,
    collection: "sessions"
});

app.use(session({
    key: SESSION_KEY,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

if (ENVIROMENT === "development") {
    app.use(logger("dev"));
    app.use(errorHandler());
} else {
    app.use(logger("short"));
}

app.use(passport.initialize());
app.use(passport.session());

// ROUTES
const profileRoutes = require("./routes/profile");
const authenticationRoutes = require("./routes/auth");
const auctionRoutes = require("./routes/auction");
const chatRoutes = require("./routes/chat");
const auctionRoutesJWT = require("./routes/auction-jwt");

app.use(cors({
    credentials: true,
    origin: "https://localhost:8080"
}));

app
    .use("/api/user", profileRoutes)
    .use("/api/auth", authenticationRoutes)
    .use("/api/chat", chatRoutes)
    .use("/api/auction", auctionRoutes)
    .use("/api/auction/jwt/", auctionRoutesJWT);

// handle production
if (ENVIROMENT === "production") {
    // eslint-disable-next-line no-path-concat
    app.use(express.static(__dirname + "/public/"));
    // eslint-disable-next-line no-path-concat
    app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}

// socket io
function onAuthorizeSuccess (data, accept) {
    console.log("successful connection to socket.io");
    accept();
}

function onAuthorizeFail (data, message, error, accept) {
    console.log("failed connection to socket.io:");
    if (error) {
        accept(new Error(message));
    }
}

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: SESSION_KEY,
    secret: SECRET,
    store: sessionStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
}));

const chatWS = require("./socketio/chat");
const auctionWS = require("./socketio/auction");

io.on("connection", (socket) => {
    chatWS(io, socket);
    auctionWS(io, socket);
});

// bad request - catches all non existing routes
app.use((req, res) => {
    res.status(404).json({
        error: `Bad request: ${req.method} ${req.originalUrl}`
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
