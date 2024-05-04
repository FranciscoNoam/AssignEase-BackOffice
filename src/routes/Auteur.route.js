const express = require("express");
const Auteurdb = require("../models/Auteur.model");
const router = express.Router();

const roleRouter = express.Router();
const cAuth = require('../controllers/Authentification.controller');

roleRouter.get('/', cAuth.verifyJWT, (req, res) => {
    try {
        Auteurdb.find().sort({_id:1}).then((result) => {
            // res.status(200).send({ message: "Success", data: result });
            res.status(200).send( result );
        }).catch((err) => {
            res.status(400).send({ message: err.message });
        });
    } catch (err) {
        console.log("api/teacher/ Error", err.message);
        res.status(400).send({ message: err.message });
    }
});


roleRouter.get('/:id', cAuth.verifyJWT, (req, res) => {
    try {
        if (isNaN(Number(req.params.id))) {
            return res.send({ status:400,message: 'Le champ dans le paramètre de la requête n\'est pas un nombre.' });
          }
        Auteurdb.findById(req.params.id).then((result) => {
            res.status(200).send({ message: "Success", data: result });
        }).catch((err) => {
            res.status(400).send({ message: err.message });
        });
    } catch (err) {
        console.log("api/teacher/" + req.params.id + " Error", err.message);
        res.status(400).send({ message: err.message });
    }
});


roleRouter.post('/', cAuth.verifyJWT, async (req, res) => {
    try {
        console.log(req.body);
        const { nom, photo } = req.body;
        if (!nom) { throw new Error("Donnée invalide"); }

        const dernierMatiere = await Auteurdb.findOne().sort({ _id: -1 });
        let dernierId = 0;
        if (dernierMatiere) {
        dernierId = dernierMatiere._id;
        }
        const nouvelId = dernierId + 1;

        const auteur = new Auteurdb({
            _id:nouvelId,
            nom:nom,
            // photo:photo,
        });
        auteur.save().then((result) => {
            res.status(200).send({status:200,  message: "Success", data: result });
        }).catch((err) => {
            res.status(400).send({status:400,  message: err.message });
        });
    } catch (err) {
        console.log("api/auteur/post Error", err.message);
        res.status(400).send({ status:400, message: err.message });
    }
});

roleRouter.put('/:id', cAuth.verifyJWT, (req, res) => {
    try {

        const { nom } = req.body;
        if (!nom ) { throw new Error("Donnée invalide"); }
        if (isNaN(Number(req.params.id))) {
            return res.send({ status:400,message: 'Le champ dans le paramètre de la requête n\'est pas un nombre.' });
          }
        Auteurdb.findByIdAndUpdate({ _id: req.params.id }, {
            nom: nom,
        }).then((result) => {
            result.nom = nom;
            res.status(200).send({status:200, message: "Success", data: result });
        }).catch((err) => {
            res.status(400).send({ status:400,message: err.message });
        });
    } catch (err) {
        console.log("api/auteur/put/" + req.params.id + " Error", err.message);
        res.status(400).send({status:400, message: err.message });
    }
});

roleRouter.delete('/:id', cAuth.verifyJWT, (req, res) => {
    try {
        console.log(req.params);
        if (isNaN(Number(req.params.id))) {
            return res.send({ status:400,message: 'Le champ dans le paramètre de la requête n\'est pas un nombre.' });
          }

        Auteurdb.deleteOne({ _id: req.params.id }).then((result) => {
            res.status(200).send({status:200, message: "Success", data: result });
        }).catch((err) => {
            res.status(400).send({status:400, message: err.message });
        });
    } catch (err) {
        console.log("api/teacher/delete/" + req.params.id + " Error", err.message);
        res.status(400).send({status:400, message: err.message });
    }
});

router.use('/api/auteur', roleRouter);


module.exports = router;