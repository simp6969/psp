const PhotoModel = require("./mongo_db/user");
const connect = require("./mongo_db/mongodb");
const express = require("express");
const cors = require("cors");
const app = express();

connect();
app.use(cors);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Yay");
});

app.listen(8080);
