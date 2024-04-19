const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    _id: { type: Number,
        validate: {
            validator: Number.isInteger, // Vérifie si la valeur est un nombre entier
            message: '{VALUE} n\'est pas un nombre entier pour le champ _id.'
          }},
    nom: { type: String, required: true },
    dateDeRendu: { type: Date },
    note: { type: Number, required: true, default: 0 },
    rendu: { type: Boolean, default: false },
    remarques: { type: String},
    auteur: {
        type: mongoose.Schema.Types.Number,
        validate: {
            validator: Number.isInteger, // Vérifie si la valeur est un nombre entier
            message: '{VALUE} n\'est pas un nombre entier pour le champ auteur.'
          },
        ref: 'auteurs',
        required: true
     },
    matiere: {
        type: mongoose.Schema.Types.Number,
        validate: {
            validator: Number.isInteger, // Vérifie si la valeur est un nombre entier
            message: '{VALUE} n\'est pas un nombre entier pour le champ matiere.'
          },
        ref: 'matieres',
        required: true
    }
});

const Assignmentdb = mongoose.model('assignments', assignmentSchema);

module.exports = Assignmentdb;
