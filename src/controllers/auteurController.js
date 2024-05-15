// let Auteur = require("../models/auteur");
const Auteurdb = require("../models/Auteur.model");
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

exports.findById = (req, res) => {
  try {
    if (isNaN(Number(req.params.id))) {
      return res.send({
        status: 400,
        message:
          "Le champ dans le paramètre de la requête n'est pas un nombre.",
      });
    }
    Auteurdb.findById(req.params.id)
      .then((result) => {
        res.status(200).send({ message: "Success", data: result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log("api/teacher/" + req.params.id + " Error", err.message);
    res.status(400).send({ message: err.message });
  }
};

exports.create = (req, res) => {
  try {
    console.log(req.body);
    const { nom, photo } = req.body;
    if (!nom) {
      throw new Error("Donnée invalide");
    }

    const auteur = new Auteurdb({
      _id: nouvelId,
      nom: nom,
    });
    auteur
      .save()
      .then((result) => {
        res.status(200).send({ status: 200, message: "Success", data: result });
      })
      .catch((err) => {
        res.status(400).send({ status: 400, message: err.message });
      });
  } catch (err) {
    console.log("api/auteur/post Error", err.message);
    res.status(400).send({ status: 400, message: err.message });
  }
};

exports.update = (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) {
      throw new Error("Donnée invalide");
    }
    if (isNaN(Number(req.params.id))) {
      return res.send({
        status: 400,
        message:
          "Le champ dans le paramètre de la requête n'est pas un nombre.",
      });
    }
    Auteurdb.findByIdAndUpdate(
      { _id: req.params.id },
      {
        nom: nom,
      }
    )
      .then((result) => {
        result.nom = nom;
        res.status(200).send({ status: 200, message: "Success", data: result });
      })
      .catch((err) => {
        res.status(400).send({ status: 400, message: err.message });
      });
  } catch (err) {
    console.log("api/auteur/put/" + req.params.id + " Error", err.message);
    res.status(400).send({ status: 400, message: err.message });
  }
};

exports.delete = (req, res) => {
  try {
    console.log(req.params);
    if (isNaN(Number(req.params.id))) {
      return res.send({
        status: 400,
        message:
          "Le champ dans le paramètre de la requête n'est pas un nombre.",
      });
    }

    Auteurdb.deleteOne({ _id: req.params.id })
      .then((result) => {
        res.status(200).send({ status: 200, message: "Success", data: result });
      })
      .catch((err) => {
        res.status(400).send({ status: 400, message: err.message });
      });
  } catch (err) {
    console.log("api/teacher/delete/" + req.params.id + " Error", err.message);
    res.status(400).send({ status: 400, message: err.message });
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

exports.deleteAuteur = (req, res) => {
  const _id = utilService.makeId(req.params.id);
  Auteurdb.findByIdAndDelete(_id)
      .then(auteur => {
          if (!auteur) {
              return res.status(404).json({ message: "Auteur not found" });
          }
          res.json({ message: "Auteur deleted successfully", auteur });
      })
      .catch(err => {
          res.status(500).json({ error: err.message });
      });
};

