const mongoose = require('mongoose');

const express = require("express");
const router = express.Router();
const roleRouter = express.Router();

const Professeurdb = require("../models/Professeur.model");
const Matieredb = require("../models/Matiere.model");

const cAuth = require("../controllers/Authentification.controller");
const Assignmentdb = require( "../models/Assignment.model" );
roleRouter.get("/", cAuth.verifyJWT, (req, res) => {
  try {
    Matieredb.find().populate({path:"prof",select:"_id nom prenom photo"})
      .then((result) => {
        res.status(200).send({ message: "Success", data: result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log("api/matiere/ Error", err.message);
    res.status(400).send({ message: err.message });
  }
});

roleRouter.get("/:id", cAuth.verifyJWT, (req, res) => {
  try {

    if (isNaN(Number(req.params.id))) {
        return res.send({ status:400,message: 'Le champ  dans le paramètre de la requête n\'est pas un nombre.' });
      }
    Matieredb.findById(req.params.id).populate({path:"prof",select:"_id nom prenom photo"})
      .then((result) => {
        res.status(200).send({ message: "Success", data: result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log("api/matiere/" + req.params.id + " Error", err.message);
    res.status(400).send({ message: err.message });
  }
});

roleRouter.post("/", cAuth.verifyJWT, async (req, res) => {
  try {
    const { nom, image, prof } = req.body;
    if (!nom || !prof) {
      throw new Error("Donnée invalide");
    }
    if (isNaN(Number(req.body.prof))) {
        return res.send({ status:400,message: 'Le champ prof dans le corps de la requête n\'est pas un nombre.' });
      }
    const verifyData = await Professeurdb.findById(prof);
    if(!verifyData){
        res.send({status:400,message:"Professeur ID est invalide"});
    }
    const dernierMatiere = await Matieredb.findOne().sort({ _id: -1 });
    let dernierId = 0;
    if (dernierMatiere) {
    dernierId = dernierMatiere._id;
    }
    const nouvelId = dernierId + 1;
    const teacher = new Matieredb({
      _id:nouvelId,
      nom:nom,
      prof:prof,
      image:image,
    });
    teacher
      .save()
      .then((result) => {
        res.status(200).send({ message: "Success", data: result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log("api/matiere/post Error", err.message);
    res.status(400).send({ message: err.message });
  }
});

roleRouter.put("/:id", cAuth.verifyJWT, (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) {
      throw new Error("Donnée invalide");
    }

    if (isNaN(Number(req.params.id))) {
        return res.send({ status:400,message: 'Le champ dans le paramètre de la requête n\'est pas un nombre.' });
      }

    Matieredb.findByIdAndUpdate(
      { _id: req.params.id },
      { nom: nom} )
      .then((result) => {
        result.nom = nom;
        res.status(200).send({ message: "Success", data: result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log("api/matiere/put/" + req.params.id + " Error", err.message);
    res.status(400).send({ message: err.message });
  }
});

roleRouter.delete("/:id", cAuth.verifyJWT, async (req, res) => {

  const session = await mongoose.startSession();
  try {
    if (isNaN(Number(req.params.id))) {
      return res.send({ status:400,message: 'Le champ dans le paramètre de la requête n\'est pas un nombre.' });
    }
      await session.withTransaction(async () => {
          await Matieredb.deleteOne({ _id: req.params.id }).session(session);
          await Assignmentdb.deleteMany({ matiere: req.params.id }).session(session);
      }, { session: session });

      res.send({ status: 200, message: 'Success' });

  } catch (error) {
    console.log("api/matiere/delete/" + req.params.id + " Error", error.message);

      res.send({ status: 400, message: 'Data invalid' });
  } finally {
      session.endSession();
  }

});


router.use("/api/matiere", roleRouter);

module.exports = router;
