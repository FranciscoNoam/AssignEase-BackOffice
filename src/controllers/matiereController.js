const matiereService = require('../services/matiereService');
let Matiere = require('./../models/matiere');

const getMatieres = (req, res) => {
    let aggregateQuery = Matiere.aggregate();

    matiereService.joinToProfesseur(aggregateQuery);

    Matiere.aggregatePaginate(
        aggregateQuery, 
        {
            page : parseInt(req.query.page) || 1,
            limit : parseInt(req.query.limit) || 0
        },
        (err, data) => {
            if(err){
                res.send(err)
            }
            res.send(data);
        }
    );
}

module.exports = {
    getMatieres
}