const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const session = require("express-session");
const expressRouter = require("../router/express-router");

const server = express();

const sessionConfig = {
  name: "malarkey",
  secret: "If you have to ask, you will never know",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));
server.use("/api", expressRouter);

module.exports = server;
