// const mongoose = require('mongoose');

// const express = require("express");
// const router = express.Router();
// const roleRouter = express.Router();

// const Professeurdb = require("../models/Professeur.model");
// const cAuth = require("../controllers/Authentification.controller");
// const Matieredb = require( "../models/Matiere.model" );
// const Assignmentdb = require( '../models/Assignment.model' );

// roleRouter.get("/", cAuth.verifyJWT, (req, res) => {
//   try {
//     Professeurdb.find()
//       .then((result) => {
//         res.status(200).send({ message: "Success", data: result });
//       })
//       .catch((err) => {
//         res.status(400).send({ message: err.message });
//       });
//   } catch (err) {
//     console.log("api/teacher/ Error", err.message);
//     res.status(400).send({ message: err.message });
//   }
// });


// roleRouter.get("/:id", cAuth.verifyJWT, (req, res) => {
//   try {
//     if (isNaN(Number(req.params.id))) {
//       return res.send({ status:400,message: 'Le champ dans le paramètre de la requête n\'est pas un nombre.' });
//     }
//     Professeurdb.findById(req.params.id)
//       .then((result) => {
//         res.status(200).send({ message: "Success", data: result });
//       })
//       .catch((err) => {
//         res.status(400).send({ message: err.message });
//       });
//   } catch (err) {
//     console.log("api/teacher/" + req.params.id + " Error", err.message);
//     res.status(400).send({ message: err.message });
//   }
// });

// roleRouter.post("/", cAuth.verifyJWT, async (req, res) => {
//   try {
//     const { nom, prenom, photo } = req.body;
//     if (!nom || !prenom) {
//       throw new Error("Donnée invalide");
//     }

//     const dernierMatiere = await Professeurdb.findOne().sort({ _id: -1 });
//     let dernierId = 0;
//     if (dernierMatiere) {
//     dernierId = dernierMatiere._id;
//     }
//     const nouvelId = dernierId + 1;
//     const teacher = new Professeurdb({
//       _id:nouvelId,
//       nom:nom,
//       prenom:prenom,
//       photo,
//     });
//     teacher
//       .save()
//       .then((result) => {
//         res.status(200).send({ message: "Success", data: result });
//       })
//       .catch((err) => {
//         res.status(400).send({ message: err.message });
//       });
//   } catch (err) {
//     console.log("api/teacher/post Error", err.message);
//     res.status(400).send({ message: err.message });
//   }
// });

// roleRouter.put("/:id", cAuth.verifyJWT, (req, res) => {
//   try {
//     if (typeof req.params.id !== 'number') {
//       return res.send({ status:400,message: 'Le champ  dans le paramètre de la requête n\'est pas un nombre.' });
//     }
//     const { nom, prenom } = req.body;
//     if (!nom || !prenom) {
//       throw new Error("Donnée invalide");
//     }
//     if (isNaN(Number(req.params.id))) {
//       return res.send({ status:400,message: 'Le champ dans le paramètre de la requête n\'est pas un nombre.' });
//     }

//     Professeurdb.findByIdAndUpdate(
//       { _id: req.params.id },
//       { nom: nom, prenom: prenom} )
//       .then((result) => {
//         result.nom = nom;
//         result.prenom=prenom;
//         res.status(200).send({ message: "Success", data: result });
//       })
//       .catch((err) => {
//         res.status(400).send({ message: err.message });
//       });
//   } catch (err) {
//     console.log("api/teacher/put/" + req.params.id + " Error", err.message);
//     res.status(400).send({ message: err.message });
//   }
// });

// roleRouter.delete("/:id", cAuth.verifyJWT, async(req, res) => { // atw transaction
//   const session = await mongoose.startSession();
//   try {
//     if (isNaN(Number(req.params.id))) {
//       return res.send({ status:400,message: 'Le champ dans le paramètre de la requête n\'est pas un nombre.' });
//     }
//     const listeMatiere = await Matieredb.find({prof:req.params.id}).select("_id");
//     var tabIdDeleted = [];
//     listeMatiere.forEach(matiere => {
//       tabIdDeleted.push(matiere._id);
//     });

//       await session.withTransaction(async () => {
//           await Professeurdb.deleteOne({ _id: req.params.id }).session(session);
//           await Matieredb.deleteMany({ prof: req.params.id }).session(session);
//           if(tabIdDeleted.length>0){
//             await Assignmentdb.deleteMany({ _id: { $in: tabIdDeleted } }).session(session);
//           }
//       }, { session: session });

//       res.send({ status: 200, message: 'Success' });

//   } catch (error) {
//     console.log("api/teacher/delete/" + req.params.id + " Error", error.message);

//       res.send({ status: 400, message: 'Data invalid' });
//   } finally {
//       session.endSession();
//   }
// });

// router.use("/api/professeur", roleRouter);

// module.exports = router;
