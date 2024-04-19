const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    _id: { type: Number,
        validate: {
            validator: Number.isInteger, // Vérifie si la valeur est un nombre entier
            message: '{VALUE} n\'est pas un nombre entier pour le champ _id.'
          }},
    nom: { type: String, required: true },
    photo: { type: String }
});

const Auteurdb = mongoose.model('auteurs', studentSchema);

module.exports = Auteurdb;
