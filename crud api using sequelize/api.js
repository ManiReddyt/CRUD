const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Sequelize = require("sequelize");
const { runInNewContext } = require("vm");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.listen(8080, () => console.log("server is running on port 8080"));

const sequelize = new Sequelize("postgres", "postgres", "9390348710", {
  host: "localhost",
  dialect: "postgres",
});

const User = sequelize.define(
  "todos",
  {
    userid: { type: Sequelize.INTEGER },
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: Sequelize.TEXT },
    completed: { type: Sequelize.BOOLEAN },
  },
  {
    tablename: "todos",
    timestamps: false,
  }
);

sequelize
  .sync()
  .then(() =>
    console.log(
      "Users table has been successfully created, if one doesn't exist"
    )
  )
  .catch((error) => console.log(error));

app.post("/post", (req, res) => {
  User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.send(err));
});

app.get("/users", (req, res) => {
  User.findAll()
    .then((users) => res.json(users))
    .catch((err) => res.send(err));
});

app.patch("/update/:id", (req, res) => {
  User.findByPk(req.params.id)
    .then((user) => {
      if (!user) res.status(404).send({ message: "user not found" });
      user.update(req.body);
    })
    .then((user) => res.send("user updated successfully"))
    .catch((err) => res.status(400).send({ message: err.message }));
});

app.delete("/delete/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => res.send("user deleted successfully"))
    .catch((err) => {
      res.status(400).send(err.message);
    });
});
