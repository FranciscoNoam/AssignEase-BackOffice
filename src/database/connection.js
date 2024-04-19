require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.URL_DB_MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => {
        console.log("Connected to mongo");
        return conn;
      })
      .catch((err) => {
        console.log("Erreur lors de la connection à MongoDB: ", err);
      });
  } catch (err) {
    console.log(err.message);
    process.exit(1);
    return null;
  }
};

module.exports = connectDB;
