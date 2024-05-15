const mongoose = require('mongoose');
const express = require("express");

const router = express.Router();

const cProfesseur = require("../controllers/Professeur.controller");
const cAuth = require('../controllers/Authentification.controller');




router.get("/",cProfesseur.findAll);


router.get("/:id",cProfesseur.findById);

// router.post("/", cAuth.verifyJWT, upload.single('photo'), cProfesseur.create);

router.put("/:id", cAuth.verifyJWT, cProfesseur.update);

router.delete("/:id", cAuth.verifyJWT, cProfesseur.delete);


module.exports = router;
