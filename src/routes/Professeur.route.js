const mongoose = require('mongoose');
const express = require("express");

const router = express.Router();

const cProfesseur = require("../controllers/Professeur.controller");
const cAuth = require('../controllers/Authentification.controller');
const uploadService = require("../services/uploadFileService");
const utilService =  require("./../services/utils");

router.get("/",cProfesseur.findAll);
router.get("/:id",cProfesseur.getProfesseur);

router.post("/:section" ,cAuth.verifyJWT,utilService.verifyFolderUpload,uploadService.upload.single('imageFile'),(req,res)=>{
    if (req.user.role == "ADMIN") {
        cProfesseur.postProfesseur(req,res);
      } else {
        return res.json({ status: 400, error: "No permission for action" });
      }
});

router.put('/:id/:section', cAuth.verifyJWT,utilService.verifyFolderUpload,uploadService.upload.single('imageFile'),(req,res)=>{
    if (req.user.role == "ADMIN") {
        cProfesseur.updateProfesseur(req,res);
      } else {
        return res.json({ status: 400, error: "No permission for action" });
      }
});

router.delete("/:id", cAuth.verifyJWT,(req,res)=>{
    if (req.user.role == "ADMIN") {
        cProfesseur.deleteProfesseur(req,res);
      } else {
        return res.json({ status: 400, error: "No permission for action" });
      }
});



module.exports = router;
