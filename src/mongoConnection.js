// mongoConnection.js
const mongoose = require("mongoose");

const connectToDB = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(
        `MongoDB connected with server : ${mongoose.connection.host}`
      );
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

module.exports = connectToDB;
