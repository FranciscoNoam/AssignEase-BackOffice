const mongoose = require('mongoose');

const matterSchema = new mongoose.Schema({
    _id: { type: Number,
        validate: {
            validator: Number.isInteger, // Vérifie si la valeur est un nombre entier
            message: '{VALUE} n\'est pas un nombre entier pour le champ _id.'
          }},
    nom: { type: String, required: true },
    image: { type: String },
    prof: {
        type: mongoose.Schema.Types.Number,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} n\'est pas un nombre entier pour le champ prof.'
          },
        ref: 'professeurs',
        required: true
    },
});

const Matieredb = mongoose.model('matieres', matterSchema);

module.exports = Matieredb;
