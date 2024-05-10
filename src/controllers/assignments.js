const { makeLookUpAssign } = require('../services/assignmentService');
let Assignment = require('./../models/assignment');
let utilService = require('./../services/utils');


function getAssignments(req, res){
    let aggregateQuery = Assignment.aggregate();
   
    makeLookUpAssign(aggregateQuery);
    
    Assignment.aggregatePaginate(
        aggregateQuery, 
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        },
        (err, data) => {
            if(err){
                res.send(err)
            }
            res.send(data);
        }
    );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;
    Assignment.findById(assignmentId, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })

    /*
    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
    */
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    Assignment.findOne().sort({id: -1}).exec()
        .then(highestAssignment => {
            let newId = 1; // ID par défaut si la collection est vide

            if (highestAssignment) {
                newId = highestAssignment.id + 1; // Incrémenter l'ID le plus élevé
            }

            let assignment = new Assignment();
            assignment.id = newId;
            assignment.nom = req.body.nom;
            assignment.dateDeRendu = req.body.dateDeRendu;
            assignment.note =  req.body.note;
            assignment.rendu = req.body.rendu;
            assignment.auteur = req.body.auteur.id;
            assignment.matiere = req.body.matiere.id;
            assignment.remarques = req.body.remarques;

            console.log("POST assignment reçu :");
            console.log(assignment);

            return assignment.save();
        })
        .then(savedAssignment => {
            res.json({ message: `${savedAssignment.nom} enregistré !`, id: savedAssignment.id });
        })
        .catch(err => {
            res.send('Impossible de poster l\'assignment : ' + err);
        });
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
// l'id est bien le _id de mongoDB
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
