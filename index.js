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
// server.use("/api/restricted", checkUserAccess());

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

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome, ${user.username}.` });
      } else {
        res.status(401).json({ error: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// function for local middleware
function checkUserAccess(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ error: "Invalid Credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: "You dun goofed" });
      });
  }
}

// POST once user is authN/authZ to show list of users
server.post("/api/users", checkUserAccess, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res.send(error);
    });
});

// server.get("/api/users", (req, res) => {
//   let { username, password } = req.body;

//   Users.findBy(username)
//     .first()
//     .then(user => {
//       if (user && bcrypt.compareSync(password, user.password)) {
//         Users.find().then(users => {
//           res.json(users);
//         });
//       } else {
//         res.status(401).json({ error: "Invalid credentials" });
//       }
//     })
//     .catch(error => {
//       res.status(500).json(error);
//     });
// });

const port = process.env.PORT || 5500;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
