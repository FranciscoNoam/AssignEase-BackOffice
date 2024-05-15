const mongoose = require("mongoose");
const fs = require("fs");

const Matieredb = require("../models/matiere");
const Assignmentdb = require("../models/assignment");
const Professeurdb = require("../models/Professeur.model");

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