const express = require("express");
const router = express.Router();

const cAuth = require('../controllers/Authentification.controller');
const matiereController = require('../controllers/matiereController');

router.get("/" ,matiereController.getMatieres);

module.exports = router;