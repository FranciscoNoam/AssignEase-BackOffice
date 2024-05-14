// let Auteur = require("../models/auteur");
const Auteurdb = require("../models/Auteur.model");

/*exports.getAuteurs = (req, res) => {
  let aggregateQuery = Auteur.aggregate();

  Auteur.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 0,
    },
    (err, data) => {
      if (err) {
        res.send(err);
      }
      res.send(data);
    }
  );
};
*/
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
