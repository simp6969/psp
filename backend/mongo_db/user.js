const { model, Schema } = require("mongoose");

const PhotoSchema = new Schema({
  base64: String,
  username: String,
  uniqueID: String,
  views: Number,
});

const PhotoModel = model("mainDB", PhotoSchema);

module.exports = { PhotoModel };
