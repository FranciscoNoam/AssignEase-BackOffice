const express = require("express");
const router = express.Router();

const cAuth = require('../controllers/Authentification.controller');
const matiereController = require('../controllers/matiereController');
const uploadService = require("../services/uploadFileService");
const utilService =  require("./../services/utils");

    router.get("/" ,cAuth.verifyJWT,matiereController.getMatieres);
    router.get("/:id" ,cAuth.verifyJWT,matiereController.getMatiere);

    router.post("/:section" ,cAuth.verifyJWT,utilService.verifyFolderUpload,uploadService.upload.single('imageFile'),(req,res)=>{
        if (req.user.role == "ADMIN") {
            matiereController.postMatiere(req,res);
          } else {
            return res.json({ status: 400, error: "No permission for action" });
          }
    });

    router.put('/:id/:section', cAuth.verifyJWT,utilService.verifyFolderUpload,uploadService.upload.single('imageFile'),(req,res)=>{
        if (req.user.role == "ADMIN") {
            matiereController.updateMatiere(req,res);
          } else {
            return res.json({ status: 400, error: "No permission for action" });
          }
    });

    router.delete('/:id', cAuth.verifyJWT,(req,res)=>{
        if (req.user.role == "ADMIN") {
            matiereController.deleteMatiere(req,res);
          } else {
            return res.json({ status: 400, error: "No permission for action" });
          }
    });

module.exports = router;