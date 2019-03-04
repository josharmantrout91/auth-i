const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./data/dbConfig.js");
const Users = require("./users/users-model.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("**Taps Mic** Is this thing on??");
});

// POST to register new user

server.post("/api/register", (req, res) => {
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, 10);

  user.password = hash;

  Users.add(user)
    .then(savedUser => {
      if (savedUser) {
        res.status(201).json(savedUser);
      } else {
        res.status(404).json({ error: "No user registered" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// POST to log in

// GET once user is authN/authZ to show list of users

const port = process.env.PORT || 5500;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
