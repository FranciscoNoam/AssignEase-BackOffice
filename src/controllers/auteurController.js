// let Auteur = require("../models/auteur");
const Auteurdb = require("../models/Auteur.model");
let Assignment = require('../models/assignment');
const utilService =  require('./../services/utils');

exports.findAll=(req,res)=>{
    try {
        Auteurdb.find().sort({id:1}).then((result) => {
            // res.status(200).send({ message: "Success", data: result });
            res.status(200).send( result );
        }).catch((err) => {
            res.status(400).send({ message: err.message });
        });
    } catch (err) {
        console.log("api/teacher/ Error", err.message);
        res.status(400).send({ message: err.message });
    }
};


exports.postAuteur = (req, res) => {
  Auteurdb.findOne().sort({ _id: -1 }).exec()
      .then(highestAuteur => {
          let newId = 1;

          if (highestAuteur) {
              newId = highestAuteur.id + 1;
          }

          let auteur = new Auteurdb();
          const auteurParse = JSON.parse(req.body['auteur']);
          auteur.id = newId;
          auteur.nom = auteurParse.nom;
          auteur.photo = auteurParse.photo;

          console.log("POST auteur reçu : ");
          console.log(auteur);

          return auteur.save();
      })
      .then(savedAuteur => {
          res.json({ message: `${savedAuteur.nom} enregistré !`, id: savedAuteur._id });
      })
      .catch(err => {
          console.log("err ", err);
          res.send('Impossible de poster l\'auteur : ' + err);
      });
};

exports.updateAuteur = async (req, res) => {
  try {
      const _id = utilService.makeId(req.params.id);
      const auteur = await Auteurdb.findById(_id);
      if (!auteur) {
          return res.status(404).json({ message: 'Auteur not found' });
      }
      
      const auteurParse = JSON.parse(req.body['auteur']);
      auteur.nom = auteurParse.nom;
      auteur.photo = auteurParse.photo;

      const updatedAuteur = await auteur.save();
      res.json({ message: 'Auteur updated', auteur: updatedAuteur });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAuteur = async (req, res) => {
  try {
      let auteurId = utilService.makeId(req.params.id);
      let aggregateQuery = Auteurdb.aggregate();

      console.log(auteurId);

      aggregateQuery._pipeline.push({
          $match: {
              _id: auteurId 
          }
      });

      aggregateQuery.exec().then(auteurs => {
          res.json(auteurs[0]);
      }).catch(err => {
          res.send(err);
      });
  } catch (err) {
    console.log("Error => ", err);
      res.send(err);
  }
};

exports.deleteAuteur = async (req, res) => {
  try {
      const _id = req.params.id;

      // Supprimer l'image de l'auteur dans le dossier uploads
      const auteur = await Auteurdb.findById(_id);
      if (!auteur) {
        return res.status(404).json({ message: "Auteur not found" });
      }

      // Supprimer les assignments créés par l'auteur
      await Assignment.deleteMany({ auteur: auteur.id });

      // Supprimer l'auteur lui-même
      await Auteurdb.findByIdAndDelete(_id);
      utilService.deleteImageFile("auteur", auteur.photo);

      res.json({ message: "Auteur deleted successfully" });
  } catch (err) {
    console.log(err);
      res.status(500).json({ error: err.message });
  }
};

