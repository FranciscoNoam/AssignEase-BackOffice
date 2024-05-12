const express = require("express");
const router = express.Router();

const cAuth = require('../controllers/Authentification.controller');
const auteurController = require('../controllers/AuteurController');

router.get("/" , cAuth.verifyJWT,auteurController.findAll);
router.get("/:id" , cAuth.verifyJWT,auteurController.findById);
router.post('/', cAuth.verifyJWT, auteurController.create);
router.put('/:id', cAuth.verifyJWT, auteurController.update);
router.delete('/:id', cAuth.verifyJWT, auteurController.delete);


module.exports = router;