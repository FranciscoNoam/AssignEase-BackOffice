const express = require("express");
const router = express.Router();

const cAuth = require('../controllers/Authentification.controller');
const auteurController = require('../controllers/auteurController');

router.get("/" ,auteurController.getAuteurs);

module.exports = router;