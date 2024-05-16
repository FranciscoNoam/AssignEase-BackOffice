const express = require("express");
const router = express.Router();

const cAuth = require('../controllers/Authentification.controller');
const auteurController = require('../controllers/AuteurController');
const uploadService = require("../services/uploadFileService");
const utilService =  require("./../services/utils");

router.get("/" , auteurController.findAll);
router.get("/:id",auteurController.getAuteur);
router.post("/:section" ,cAuth.verifyJWT,utilService.verifyFolderUpload,uploadService.upload.single('imageFile'),auteurController.postAuteur);
router.put('/:id/:section', cAuth.verifyJWT,utilService.verifyFolderUpload,uploadService.upload.single('imageFile'),auteurController.updateAuteur);
router.delete("/:id", cAuth.verifyJWT, auteurController.deleteAuteur);


module.exports = router;