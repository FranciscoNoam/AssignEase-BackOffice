const mongoose = require('mongoose');
const express = require("express");

const router = express.Router();

const cProfesseur = require("../controllers/Professeur.controller");
const cAuth = require('../controllers/Authentification.controller');
const uploadService = require("../services/uploadFileService");
const utilService =  require("./../services/utils");

router.get("/",cProfesseur.findAll);
router.post("/:section" ,cAuth.verifyJWT,utilService.verifyFolderUpload,uploadService.upload.single('imageFile'),cProfesseur.postProfesseur);
router.put('/:id/:section', cAuth.verifyJWT,utilService.verifyFolderUpload,uploadService.upload.single('imageFile'),cProfesseur.updateProfesseur);
router.delete("/:id", cAuth.verifyJWT, cProfesseur.deleteProfesseur);
router.get("/:id",cProfesseur.getProfesseur);


module.exports = router;
