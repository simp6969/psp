const PhotoModel = require("./mongo_db/user");
const connect = require("./mongo_db/mongodb");
const express = require("express");
const cors = require("cors");
const app = express();

connect();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Yay");
});

app.post("/picture", async (req, res) => {
  const body = req.body;
  const model = {
    base64: body.base64,
    username: body.username,
    uniqueID: body.uniqueID,
    views: 1,
  };
  await PhotoModel.PhotoModel.create(model);
  res.status(200);
  res.send(model);
});

app.listen(3001);
