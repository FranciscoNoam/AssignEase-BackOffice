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



//++++++++++++++++++++++++ Connection BDD +++++++++++++++++++++++++

const connectDB = require("./src/database/connection");
connectDB();

// +++++++++++++++++++++++ Importation des routes ++++++++++++++++++++++++++++++++

app.use("/", require("./src/routes/Professeur.route"));
app.use("/", require("./src/routes/Auteur.route"));
app.use("/", require("./src/routes/Matiere.route"));
app.use("/", require("./src/routes/Assignment.route"));

//++++++++++++++++++++++++ Importation Controllers  +++++++++++++++++++++++++++++++++++++

const cAuth = require('./src/controllers/Authentification.controller');
//++++++++++++++++++++++++ Importation Models +++++++++++++++++++++++++++++++++++++++++


//++++++++++++++++++++++++ API ++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get('/api/init-users', cAuth.createUserInit);
app.post("/login", cAuth.authUser);
app.get('/',  (req, res) => {
    res.send('Backend API connecté');
});

//++++++++++++++++++++++++ END API ++++++++++++++++++++++++++++++++++++++++++++++++++++++




app.use(function (req, res) {
    res.send({ status: 404, message: 'API introuvable' });
});



var PORT = process.env.PORT || 3000;
var IP = process.env.IP;
server.listen(PORT, () => {

    console.log(`App is listening at Ip:${IP}:${PORT}`);

});
