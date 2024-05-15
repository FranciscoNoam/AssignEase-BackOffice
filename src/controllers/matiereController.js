const matiereService = require('../services/matiereService');
let Matiere = require('./../models/matiere');
const utilService =  require('./../services/utils');

const getMatieres = (req, res) => {
    let aggregateQuery = Matiere.aggregate();

    matiereService.joinToProfesseur(aggregateQuery);

    aggregateQuery.exec().then(data => {
        res.send(data);
    }).catch(err => {
        res.send(err);
    });
}

function postMatiere(req, res) {
    Matiere.findOne().sort({ id: -1 }).exec()
        .then(highestMatiere => {
            let newId = 1;

            if (highestMatiere) {
                newId = highestMatiere.id + 1;
            }

            let matiere = new Matiere();
            const matierParse = JSON.parse(req.body['matiere']);
            matiere.id = newId;
            matiere.nom = matierParse.nom;
            matiere.image = matierParse.image; 
            matiere.prof = matierParse.prof.id;

            console.log("POST matière reçue : ");
            console.log(matiere);

            return matiere.save();
        })
        .then(savedMatiere => {
            res.json({ message: `${savedMatiere.nom} enregistrée !`, id: savedMatiere.id });
        })
        .catch(err => {
            res.send('Impossible de poster la matière : ' + err);
        });
}

const getMatiere = (req, res) => {
    let matiereId = utilService.makeId(req.params.id);

    let aggregateQuery = Matiere.aggregate();

    aggregateQuery._pipeline.push({
        $match: {
            _id: matiereId 
        }
    });

    matiereService.joinToProfesseur(aggregateQuery);

    aggregateQuery.exec().then(matieres => {
        res.json(matieres[0]);
    }).catch(err => {
        res.send(err);
    });
}

const updateMatiere = async (req, res) => {
    try {
        const _id = utilService.makeId(req.params.id);
        const matiere = await Matiere.findById(_id);
        if (!matiere) {
            return res.status(404).json({ message: 'Matiere not found' });
        }
        
        const matiereParse = JSON.parse(req.body['matiere']);
        matiere.nom = matiereParse.nom;
        matiere.image = matiereParse.image;
        matiere.prof = matiereParse.prof.id;

        const updatedMatiere = await matiere.save();
        res.json({ message: 'Matiere updated', matiere: updatedMatiere });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const deleteMatiere = (req, res) => {
    const _id = utilService.makeId(req.params.id);
    Matiere.findByIdAndDelete(_id)
        .then(matiere => {
            if (!matiere) {
                return res.status(404).json({ message: "Matiere not found" });
            }
            res.json({ message: "Matiere deleted successfully", matiere });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};



module.exports = {
    getMatieres,
    postMatiere,
    deleteMatiere,
    getMatiere,
    updateMatiere
}