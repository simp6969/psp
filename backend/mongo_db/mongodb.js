const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGO_DB_CONNECTION_STRING;

const connect = async () => {
  try {
    await mongoose.connect(url);
    console.log("successfully connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
