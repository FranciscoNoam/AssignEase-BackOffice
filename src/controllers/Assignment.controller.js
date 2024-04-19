const Assignmentdb = require("../models/Assignment.model");

exports.find = async (req,res) => {

  try {
    var debutPagination = 0;
    var limitPagination = 50;
    var nextLine = limitPagination;

    const count = await Assignmentdb.countDocuments();

    const totalCount = count;
    const itemsPerPage = limitPagination;

    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const paginationArray = [];

    if(req.params.page){
        if (isNaN(Number(req.params.page))) {
            return res.send({ status:400,message: 'Le champ dans le paramètre de la requête n\'est pas un nombre.' });
          } else {
            if(req.params.page<=0  || req.params.page>itemsPerPage){
              req.params.page = 1;
            }
            nextLine = (limitPagination*req.params.page);
            debutPagination = (nextLine-limitPagination);
          }
    }

    const results = await Assignmentdb.find()
        .populate({ path: "auteur", select: "_id nom photo" })
        .populate({
        path: "matiere",
        populate: { path: "prof", select: "_id nom prenom photo" },
        select: "_id nom image prof",
        }) .limit(limitPagination)
        .skip(debutPagination)
        .sort({ _id: 1 });



    for (let i = 0; i < totalPages; i++) {
        paginationArray.push(i+1);
    }

  res.send({ status: 200, message: "Success", data: results,totalePagination: totalPages,limitPagination: limitPagination,paginateTab: paginationArray });

  } catch (error) {
    console.log("Assignement controller find error: "+error.message);
    res.send({status:400,message:"Error to get data"});
  }

};

exports.findById = (req,res)=>{
  try {
    if (isNaN(Number(req.params.id))) {
      return res.send({ status:400,message: 'Le champ dans le paramètre de la requête n\'est pas un nombre.' });
    }
    Assignmentdb.findById(req.params.id)
        .populate({ path: "auteur", select: "_id nom photo" })
        .populate({
        path: "matiere",
        populate: { path: "prof", select: "_id nom prenom photo" },
        select: "_id nom image prof",
        })
      .then((result) => {
        res.send({status:200, message: "Success", data: result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log("api/assignment/" + req.params.id + " Error", err.message);
    res.status(400).send({ message: err.message });
  }
};

exports.create = async(req,res)=>{
  try {
    const { nom, dateDeRendu,note, rendu,remarques,auteur, matiere } = req.body;
    if (!nom || !dateDeRendu || !note || !auteur || !matiere) {
      throw new Error("Donnée invalide");
    }
    // if (!nom || !dateDeRendu || !note || !rendu || !remarques || !auteur || !matiere) {
    //   throw new Error("Donnée invalide");
    // }
    // if (rendu!=false || rendu!=true) {
    //   return res.send({ status:400,message: 'Le champ rendu de la requête n\'est pas un boolean.' });
    // }
    if (isNaN(Number(note))) {
      return res.send({ status:400,message: 'Le champ note de la requête n\'est pas un nombre.' });
    }
    if (isNaN(Number(auteur))) {
      return res.send({ status:400,message: 'Le champ auteur de la requête n\'est pas un nombre.' });
    }
    if (isNaN(Number(matiere))) {
      return res.send({ status:400,message: 'Le champ matière de la requête n\'est pas un nombre.' });
    }
    const parsedDate = Date.parse(dateDeRendu);
    if (isNaN(parsedDate)) {
      return res.send({ status:400,message: 'Le champ date de rendu de la requête n\'est pas un date.' });
    }
    const dernierMatiere = await Assignmentdb.findOne().sort({ _id: -1 });
    let dernierId = 0;
    if (dernierMatiere) {
    dernierId = dernierMatiere._id;
    }
    const nouvelId = dernierId + 1;

    const teacher = new Assignmentdb({
      _id:nouvelId,
      nom:nom,
      dateDeRendu:parsedDate,
      note:note,
      rendu:rendu,
      remarques:remarques,
      auteur:auteur,
      matiere:matiere
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
    console.log("api/assignment/post Error", err.message);
    res.status(400).send({ message: "Error to save data" });
  }
};

exports.update = (req,res)=>{
try {
  const { nom, dateDeRendu,note, rendu,remarques,auteur,matiere } = req.body;
  if (!nom || !dateDeRendu || !note || !auteur || !matiere) {
    throw new Error("Donnée invalide");
  }
  /* if (nom==null || !dateDeRendu || !note || !rendu || !remarques || !auteur || !matiere) {
    throw new Error("Donnée invalide");
  }
  if (rendu!=false || rendu!=true) {
    return res.send({ status:400,message: 'Le champ rendu de la requête n\'est pas un boolean.' });
  }*/

  if (isNaN(Number(note))) {
    return res.send({ status:400,message: 'Le champ note de la requête n\'est pas un nombre.' });
  }
  if (isNaN(Number(auteur))) {
    return res.send({ status:400,message: 'Le champ auteur de la requête n\'est pas un nombre.' });
  }
  if (isNaN(Number(matiere))) {
    return res.send({ status:400,message: 'Le champ matière de la requête n\'est pas un nombre.' });
  }
  const parsedDate = Date.parse(req.body.dateDeRendu);
  if (isNaN(parsedDate)) {
    return res.send({ status:400,message: 'Le champ date de rendu de la requête n\'est pas un date.' });
  }

  Assignmentdb.findByIdAndUpdate(
    { _id: req.params.id },
    {  nom:nom, dateDeRendu:parsedDate, note:note, rendu:rendu,remarques:remarques, auteur:auteur,matiere:matiere} )
    .then((result) => {
      result.nom = nom;
      result.dateDeRendu=dateDeRendu;
      result.note=note;
      result.rendu=rendu;
      result.remarques=remarques;
      result.auteur=auteur;
      result.matiere=matiere;

      res.status(200).send({ message: "Success", data: result });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });

} catch (error) {
  console.log("api/assignment/update Error", error.message);
  res.status(400).send({ message: error.message });
}
};

exports.delete = (req,res)=>{
  try {
    if (isNaN(Number(req.params.id))) {
      return res.send({ status:400,message: 'Le champ dans le paramètre de la requête n\'est pas un nombre.' });
    }
    Assignmentdb.deleteOne({ _id: req.params.id })
      .then((result) => {
        res.status(200).send({ message: "Success", data: result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log("api/assignment/delete/" + req.params.id + " Error", err.message);
    res.status(400).send({ message: err.message });
  }
};