const { model, Schema } = require("mongoose");

const PhotoSchema = new Schema({
  base64: String,
  username: String,
  uniqueID: String,
});

const PhotoModel = model("photo", PhotoSchema);

module.exports = { PhotoModel };
