const { makeLookUpAssign, makeFilterAssign, makeSortAssign } = require('../services/assignmentService');
let Assignment = require('../models/assignment');
let utilService = require('../services/utils');


function getAssignments(req, res){
    let aggregateQuery = Assignment.aggregate();
   
    makeLookUpAssign(aggregateQuery);
    
    const { filters, sorts } = req.body;


    if (filters && filters.length > 0) {
       makeFilterAssign(aggregateQuery , filters);
    }

    if (sorts && sorts.length > 0) {
       makeSortAssign(aggregateQuery , sorts)
    }

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
    let assignmentId = utilService.makeId(req.params.id);

    let aggregateQuery = Assignment.aggregate();

    aggregateQuery._pipeline.push({
        $match: {
            _id: assignmentId 
        }
    });

    makeLookUpAssign(aggregateQuery);
    
    Assignment.aggregate(
        aggregateQuery
        .then(assignment => {
            res.json(assignment[0]);
        })
        .catch(err => {
            res.send(err);
        })
    )
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
            assignment.dateDeRendu = utilService.makeDate(req.body.dateDeRendu);
            assignment.auteur = req.body.auteur.id;
            assignment.matiere = req.body.matiere.id;

            console.log("POST assignment reçu : ");
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
async function updateAssignment(req, res) {
    try {
        const _id = utilService.makeId(req.body._id);
        const assignment = await Assignment.findById(_id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        assignment.nom = req.body.nom;
        assignment.dateDeRendu = utilService.makeDate(req.body.dateDeRendu);
        assignment.note = req.body.note;
        assignment.rendu = req.body.rendu;
        assignment.auteur = req.body.auteur.id;
        assignment.matiere = req.body.matiere.id;
        assignment.remarques = req.body.remarques;

        const updatedAssignment = await assignment.save();
        res.json({ message: 'updated', assignment: updatedAssignment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
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
