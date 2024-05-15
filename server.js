const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const fs = require('fs');


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

//+++++++++++++++++++ Storage file +++++++++++++++++++++++++++++

const cleanFileName = (fileName) => {
    return fileName.replace(/[^\w\s.-]/gi, '-');
  };
  const uploadDirectory = 'uploads/profil_professeur';
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
  }

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
      const cleanedFileName = cleanFileName(file.originalname);
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const uploadProfilTeacher = multer({ storage: storage });

// Importation des routes
// app.use("/", require("./src/routes/Professeur.route"));
// app.use("/", require("./src/routes/Auteur.route"));
// app.use("/", require("./src/routes/Matiere.route"));
app.use("/api/assignment", require("./src/routes/assignmentRoute"));
app.use("/api/matiere", require("./src/routes/matiereRoute"));
app.use("/api/auteur", require("./src/routes/auteurRoute"));
app.use("/api/teacher", require("./src/routes/Professeur.route"));

// Importation Controllers
const authController = require('./src/controllers/Authentification.controller');
const cProfesseur = require("./src/controllers/Professeur.controller");

// API
app.get('/api/init-users', authController.createUserInit);
app.post("/login", authController.authUser);
app.get('/', (req, res) => {
    res.send('Backend API connecté');
});


//++++++++++++++++++ API Professeur contenant des fichiers +++++++++++++++++++++++++++++
app.post("/api/teacher",authController.verifyJWT, uploadProfilTeacher.single('photo'), cProfesseur.create);
app.put("/api/teacher/change-profil/:id",authController.verifyJWT, uploadProfilTeacher.single('photo'), cProfesseur.updateProfile);











// Gestion de l'API introuvable
app.use(function (req, res) {
    res.status(404).send({ status: 404, message: 'API introuvable' });
});

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || '127.0.0.1';

server.listen(PORT, IP, () => {
    console.log(`App is listening at http://${IP}:${PORT}`);
});
