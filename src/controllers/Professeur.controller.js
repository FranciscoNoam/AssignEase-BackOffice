const mongoose = require("mongoose");
const fs = require("fs");

const Matieredb = require("../models/matiere");
const Assignmentdb = require("../models/assignment");
const Professeurdb = require("../models/Professeur.model");
const utilService =  require('./../services/utils');



exports.findAll = (req, res) => {
  try {
    Professeurdb.find()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send({ status: 400, message: err.message });
      });
  } catch (err) {
    console.log("api/teacher/ Error", err.message);
    res.send({ status: 400, message: err.message });
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
    Professeurdb.findById(req.params.id)
      .then((result) => {
        res.send({ status: 200, message: "Success", data: result });
      })
      .catch((err) => {
        res.send({ status: 400, message: err.message });
      });
  } catch (err) {
    console.log("api/teacher/" + req.params.id + " Error", err.message);
    res.send({ status: 400, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nom, prenom, photo } = req.body;
    if (!nom || !prenom) {
      throw new Error("Donnée invalide");
    }

    const dernierMatiere = await Professeurdb.findOne().sort({ _id: -1 });
    let dernierId = 0;
    if (dernierMatiere) {
      dernierId = dernierMatiere._id;
    }
    const nouvelId = dernierId + 1;
    const newPhotoPath = req.file.path.replace(
      "uploads/profil_professeur",
      "profil-teacher"
    );

    const teacher = new Professeurdb({
      _id: nouvelId,
      nom: nom,
      prenom: prenom,
      photo: newPhotoPath,
    });
    teacher
      .save()
      .then((result) => {
        res.send({ status: 200, message: "Success", data: result });
      })
      .catch((err) => {
        res.send({ status: 400, message: err.message });
      });
  } catch (err) {
    console.log("api/teacher/post Error", err.message);
    res.send({ status: 400, message: err.message });
  }
};

exports.update = (req, res) => {
  try {

    var id = JSON.parse(req.params.id);
    if (typeof id !== "number") {
      return res.send({
        status: 400,
        message:
          "Le champ  dans le paramètre de la requête n'est pas un nombre.",
      });
    }
    const { nom, prenom } = req.body;
    if (!nom || !prenom) {
      throw new Error("Donnée invalide");
    }
    if (isNaN(Number(id))) {
      return res.send({
        status: 400,
        message:
          "Le champ dans le paramètre de la requête n'est pas un nombre.",
      });
    }

    Professeurdb.findByIdAndUpdate(
      { _id: id },
      { nom: nom, prenom: prenom }
    )
      .then((result) => {
        result.nom = nom;
        result.prenom = prenom;
        res.send({ status: 200, message: "Success", data: result });
      })
      .catch((err) => {
        res.send({ status: 400, message: err.message });
      });
  } catch (err) {
    console.log("api/teacher/put/" + req.params.id + " Error", err.message);
    res.send({ status: 400, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
    try {

        var id = JSON.parse(req.params.id);
        if (typeof id !== "number") {
          return res.send({
            status: 400,
            message:
              "Le champ  dans le paramètre de la requête n'est pas un nombre.",
          });
        }

      if (isNaN(Number(id))) {
        return res.send({
          status: 400,
          message:
            "Le champ dans le paramètre de la requête n'est pas un nombre.",
        });
      }

      const teacher = await Professeurdb.findById(id);
    if (!teacher) {
      return res.send({ status: 400, message: "Professeur non trouvé" });
    }

      const newPhotoPath = req.file.path.replace(
        "uploads/profil_professeur",
        "profil-teacher"
      );

      var imagePath = teacher.photo;
      imagePath = imagePath.replace(
        "profil-teacher",
        "uploads/profil_professeur"
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      Professeurdb.findByIdAndUpdate(
        { _id: id },
        { photo: newPhotoPath}
      )
        .then((result) => {
         res.send({ status: 200, message: "Success", data: result });
        })
        .catch((err) => {
          res.send({ status: 400, message: err.message });
        });
    } catch (err) {
      console.log("api/teacher/put/" + req.params.id + " Error", err.message);
      res.send({ status: 400, message: err.message });
    }
  };

exports.delete = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    if (isNaN(Number(req.params.id))) {
      return res.send({
        status: 400,
        message:
          "Le champ dans le paramètre de la requête n'est pas un nombre.",
      });
    }
    const teacher = await Professeurdb.findById(req.params.id);
    if (!teacher) {
      return res.send({ status: 400, message: "Professeur non trouvé" });
    }

    var imagePath = teacher.photo;

    imagePath = imagePath.replace(
      "profil-teacher",
      "uploads/profil_professeur"
    );

    const listeMatiere = await Matieredb.find({ prof: req.params.id }).select(
      "_id"
    );
    var tabIdDeleted = [];
    listeMatiere.forEach((matiere) => {
      tabIdDeleted.push(matiere._id);
    });

    await session.withTransaction(
      async () => {
        await Professeurdb.deleteOne({ _id: req.params.id }).session(session);
        await Matieredb.deleteMany({ prof: req.params.id }).session(session);
        if (tabIdDeleted.length > 0) {
          await Assignmentdb.deleteMany({ _id: { $in: tabIdDeleted } }).session(
            session
          );
        }
      },
      { session: session }
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    res.send({ status: 200, message: "Success" });
  } catch (error) {
    console.log(
      "api/teacher/delete/" + req.params.id + " Error",
      error.message
    );

    res.send({ status: 400, message: "Data invalid" });
  } finally {
    session.endSession();
  }
};


exports.postProfesseur = (req, res) => {
  Professeurdb.findOne().sort({ _id: -1 }).exec()
      .then(highestProfesseur => {
          let newId = 1;

          if (highestProfesseur) {
              newId = highestProfesseur.id + 1;
          }

          let professeur = new Professeurdb();
          const profParse = JSON.parse(req.body['professeur']);
          professeur.id = newId;
          professeur.nom = profParse.nom;
          professeur.prenom = profParse.prenom;
          professeur.photo = profParse.photo;

          console.log("POST professeur reçu : ");
          console.log(professeur);

          return professeur.save();
      })
      .then(savedProfesseur => {
          res.json({ message: `${savedProfesseur.nom} ${savedProfesseur.prenom} enregistré(e) !`, id: savedProfesseur._id });
      })
      .catch(err => {
        console.log("err ", err);
          res.send('Impossible de poster le professeur : ' + err);
      });
}

exports.updateProfesseur = async (req, res) => {
  try {
      const _id = utilService.makeId(req.params.id);
      const professeur = await Professeurdb.findById(_id);
      if (!professeur) {
          return res.status(404).json({ message: 'Professeur not found' });
      }
      
      const professeurParse = JSON.parse(req.body['professeur']);
      professeur.nom = professeurParse.nom;
      professeur.prenom = professeurParse.prenom;
      professeur.photo = professeurParse.photo;

      const updatedProfesseur = await professeur.save();
      res.json({ message: 'Professeur updated', professeur: updatedProfesseur });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProfesseur = async (req, res) => {
  try {
      let professeurId = utilService.makeId(req.params.id);
      let aggregateQuery = Professeurdb.aggregate();

      aggregateQuery._pipeline.push({
          $match: {
              _id: professeurId 
          }
      });

      aggregateQuery.exec().then(professeurs => {
          res.json(professeurs[0]);
      }).catch(err => {
          res.send(err);
      });
  } catch (err) {
      res.send(err);
  }
};

exports.deleteProfesseur = async (req, res) => {
  try {
    const _id = req.params.id;
        
    const professeur = await Professeurdb.findById(_id);
    if (!professeur) {
      return res.status(404).json({ message: "Professeur not found" });
    }

    const matieresEnseignees = await Matieredb.find({ professeur: _id });
   
    // Extraire les IDs des matières
    const idsMatieres = matieresEnseignees.map(matiere => matiere._id);

    // Supprimer les matières enseignées par le professeur et ses photos (matiere)
    await Matieredb.deleteMany({ prof: professeur.id });
    for (const matiere of matieresEnseignees) {
      utilService.deleteImageFile("matiere", matiere.image);
    }

    // Supprimer les assignments associés aux matières supprimées
    await Assignmentdb.deleteMany({ matiere: { $in: idsMatieres } });

    // Supprimer le professeur lui-même et son photo
    await Professeurdb.findByIdAndDelete(_id);

    utilService.deleteImageFile("professeur" , professeur.photo);

    res.json({ message: "Professeur deleted successfully" });
  } catch (err) {
    console.log(err);
        res.status(500).json({ error: err.message });
    }
};


