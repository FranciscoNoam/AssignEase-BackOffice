const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    // _id: { type: Number,
    //     validate: {
    //         validator: Number.isInteger, // Vérifie si la valeur est un nombre entier
    //         message: '{VALUE} n\'est pas un nombre entier pour le champ _id.'
    //       }},
    id : Number,
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    photo: { type: String },
});

const Professeurdb = mongoose.model('professeurs', teacherSchema);

module.exports = Professeurdb;
