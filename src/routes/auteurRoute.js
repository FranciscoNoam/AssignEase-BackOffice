const express = require("express");
const router = express.Router();

const cAuth = require('../controllers/Authentification.controller');
const auteurController = require('../controllers/auteurController');
const uploadService = require("../services/uploadFileService");
const utilService =  require("./../services/utils");

router.get("/" , auteurController.findAll);
router.get("/:id",auteurController.getAuteur);

router.post("/:section" ,cAuth.verifyJWT,utilService.verifyFolderUpload,uploadService.upload.single('imageFile'),(req,res)=>{
    if (req.user.role == "ADMIN") {
        auteurController.postAuteur(req,res);
      } else {
        return res.json({ status: 400, error: "No permission for action" });
      }
});

router.put('/:id/:section', cAuth.verifyJWT,utilService.verifyFolderUpload,uploadService.upload.single('imageFile'),(req,res)=>{
    if (req.user.role == "ADMIN") {
        auteurController.updateAuteur(req,res);
      } else {
        return res.json({ status: 400, error: "No permission for action" });
      }
});

router.delete("/:id", cAuth.verifyJWT,(req,res)=>{
    if (req.user.role == "ADMIN") {
        auteurController.deleteAuteur(req,res);
      } else {
        return res.json({ status: 400, error: "No permission for action" });
      }
});


module.exports = router;