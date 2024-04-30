require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const uri_local = "mongodb+srv://mopolo-big-data:develop@cluster0.ce7mg8k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    await mongoose
      .connect(process.env.URL_DB_MONGO || uri_local, {
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
