const express = require("express");
const router = express.Router();

const cAuth = require('../controllers/Authentification.controller');
const matiereController = require('../controllers/matiereController');
const uploadService = require("../services/uploadFileService");
const utilService =  require("./../services/utils");

try {
    router.get("/" ,matiereController.getMatieres);
    router.post("/:section" ,cAuth.verifyJWT,utilService.verifyFolderUpload,uploadService.upload.single('imageFile'),matiereController.postMatiere);
    router.put('/:id/:section', cAuth.verifyJWT,utilService.verifyFolderUpload,uploadService.upload.single('imageFile'),matiereController.updateMatiere);
    router.get("/:id" ,matiereController.getMatiere);
    router.delete('/:id', cAuth.verifyJWT, matiereController.deleteMatiere);
}catch(error){
    console.log("Error ==> ", error);
}

module.exports = router;