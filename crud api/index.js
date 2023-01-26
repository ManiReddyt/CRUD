const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/users", (req, res) => {
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    data = JSON.parse(data);
    res.send(data);
  });
});

app.get("/users/:id", (req, res) => {
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    data = JSON.parse(data);
    res.send(data[Number.parseInt(req.params.id) - 1]);
  });
});

app.post("/post", (req, res) => {
  let obj = req.body;
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    data = JSON.parse(data);
    data.push(obj);
    fs.writeFile(
      __dirname + "/" + "users.json",
      JSON.stringify(data),
      (err) => {
        if (err) console.log(err);
      }
    );
  });
  res.send("post done");
});

app.delete("/delete/:id", (req, res) => {
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    data = JSON.parse(data);
    data = data.filter(
      (obj, index) => index !== Number.parseInt(req.params.id)
    );
    fs.writeFile(
      __dirname + "/" + "users.json",
      JSON.stringify(data),
      (err) => {
        if (err) console.log(err);
      }
    );
    res.send("delete done");
  });
});

app.patch("/update/:id", (req, res) => {
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    data = JSON.parse(data);
    data.forEach((d) => {
      if (d.id === Number.parseInt(req.params.id)) {
        const updatebody = req.body;
        if (updatebody.userId) d.userId = updatebody.userId;
        if (updatebody.title) d.title = updatebody.title;
        if (updatebody.completed) d.completed = updatebody.completed;
      }
    });

    // const obj = data.find((d) => d.id === Number.parseInt(req.params.id));
    // const id = Number.parseInt(req.params.id) - 1;
    // const updatebody = req.body;
    // if (updatebody.userId) data[id].userId = updatebody.userId;
    // if (updatebody.title) data[id].title = updatebody.title;
    // if (updatebody.completed) data[id].completed = updatebody.completed;
    fs.writeFile(
      __dirname + "/" + "users.json",
      JSON.stringify(data),
      (err) => {
        if (err) console.log(err);
      }
    );
    res.send("update done");
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on port number ${port}`));
