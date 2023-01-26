const client = require("./connection.js");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.listen(8080, () => {
  console.log("server running on port 8080");
});

client.connect();
// client.connect();

app.get("/users", (req, res) => {
  client.query(`select * from todos`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      res.send(err.message);
    }
  });
});

app.get("/users/:id", (req, res) => {
  client.query(
    `select * from todos where id=${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      } else {
        res.send(err.message);
      }
    }
  );
});
// client.connect();

app.post("/post", (req, res) => {
  const user = req.body;
  console.log(user.userid, user.id, user.title, user.completed);
  const insertQuery = `insert into todos(userid,id,title,completed)
    values(${user.userid},${user.id},'${user.title}','${user.completed}')`;
  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Posting user successful");
    } else {
      console.log(err);
      res.send(err.message);
    }
  });
});

app.patch("/update/:id", (req, res) => {
  const user = req.body;
  const insertQuery = `update todos set title='${user.title}'
                        where id=${req.params.id}`;
  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("update successful");
    } else {
      res.send(err.message);
    }
  });
});

app.delete("/delete/:id", (req, res) => {
  const deleteQuery = `delete from todos where id=${req.params.id}`;
  client.query(deleteQuery, (err, result) => {
    if (!err) res.send("delete success");
    else res.send(err.message);
  });
});
