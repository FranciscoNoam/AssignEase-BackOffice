const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const app = express();
const server = require("http").createServer(app);

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(cors(corsOptions));

// Connection BDD
const connectDB = require("./src/database/connection");
connectDB();

// Importation des routes
app.use("/", require("./src/routes/Professeur.route"));
app.use("/", require("./src/routes/Auteur.route"));
app.use("/", require("./src/routes/Matiere.route"));
app.use("/", require("./src/routes/Assignment.route"));

// Importation Controllers
const authController = require('./src/controllers/Authentification.controller');

// API
app.get('/api/init-users', authController.createUserInit);
app.post("/login", authController.authUser);
app.get('/', (req, res) => {
    res.send('Backend API connecté');
});

// Gestion de l'API introuvable
app.use(function (req, res) {
    res.status(404).send({ status: 404, message: 'API introuvable' });
});

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || '127.0.0.1'; 

server.listen(PORT, IP, () => {
    console.log(`App is listening at http://${IP}:${PORT}`);
});
