const express = require("express");
const server = express();
const DB = require("./data/db");

server.use(express.json());

server.post("/api/users", (req, res) => {
  const userInfo = req.body;
  
  if (!userInfo.name || !userInfo.bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  }
  else {
    DB
    .insert(userInfo)
    .then(({id}) => {
      DB
        .findById(id)
        .then((newUserInfo) => {
          res.status(200).json(newUserInfo);
        });
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
    });
  }
});

server.get("/api/users", (req, res) => {
  DB
  .find()
  .then(allUsers => {
    res.status(200).json(allUsers);
  })
  .catch(() => {
    res.status(500).json({ errorMessage: "The users information could not be retrieved." });
  });
});

server.get("/api/users/:id", (req, res) => {
  DB
  .findById(req.params.id)
  .then(userInfo => {
    if (!userInfo) {
      res.status(404).json({ errorMessage: "The user with the specified ID does not exist." });
    }
    else {
      res.status(200).json(userInfo);
    }
  })
  .catch(() => {
    res.status(500).json({ errorMessage: "The user information could not be retrieved." });
  });
});

server.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  
  DB
  .findById(userId)
  .then(userInfo => {
    if (!userInfo) {
      res.status(404).json({ errorMessage: "The user with the specified ID does not exist." });
    }
    else {
      DB
      .remove(userId)
      .then(() => {
        res.status(200).json(userInfo);
      })
      .catch(() => {
        res.status(500).json({ errorMessage: "The user could not be removed" });
      });
    }
  })
  .catch(() => {
    res.status(500).json({ errorMessage: "????" });
  });
});

server.put("/api/users/:id", (req, res) => {
  const userInfo = req.body;
  const userId = req.params.id;
  
  DB
    .findById(userId)
    .then((existingUser) => {
      if (!existingUser) {
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist." });
      }
      else if (!userInfo.name || !userInfo.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
      }
      else {
        DB
        .update(userId, userInfo)
        .then(() => {
          DB
          .findById(userId)
          .then((updatedUserInfo) => {
            res.status(200).json(updatedUserInfo);
          });
        })
        .catch(err => {
          res.status(500).json({ errorMessage: "The user information could not be modified." });
        });
      }
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "The user with the specified ID does not exist." });
    });;
});

server.listen(5000, () => console.log("Express Running"));