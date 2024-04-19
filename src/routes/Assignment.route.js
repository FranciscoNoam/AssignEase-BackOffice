const express = require("express");
const Auteurdb = require("../models/Auteur.model");
const router = express.Router();

const roleRouter = express.Router();
const cAuth = require('../controllers/Authentification.controller');
const cAssignment = require('../controllers/Assignment.controller');

roleRouter.get('/all/:page?', cAuth.verifyJWT, cAssignment.find);

roleRouter.get('/:id', cAuth.verifyJWT, cAssignment.findById);

roleRouter.post('/', cAuth.verifyJWT,cAssignment.create);

roleRouter.put('/:id', cAuth.verifyJWT, cAssignment.update);

roleRouter.delete('/:id', cAuth.verifyJWT, cAssignment.delete);

router.use('/api/assignment', roleRouter);


module.exports = router;