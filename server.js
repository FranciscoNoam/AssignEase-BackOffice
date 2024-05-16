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

app.use('/public', express.static('uploads'));

app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(cors(corsOptions));

app.use("/profil-teacher", express.static("uploads/profil_professeur/"));

// Connection BDD
const connectDB = require("./src/database/connection");
connectDB();

app.use("/api/assignment", require("./src/routes/assignmentRoute"));
app.use("/api/matiere", require("./src/routes/matiereRoute"));
app.use("/api/auteur", require("./src/routes/auteurRoute"));
app.use("/api/teacher", require("./src/routes/Professeur.route"));
app.use("/api/professeur", require("./src/routes/Professeur.route"));
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
