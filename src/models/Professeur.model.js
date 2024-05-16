const mongoose = require('mongoose');

const professeur = new mongoose.Schema({
    id : Number,
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    photo: { type: String },
});

const Professeurdb = mongoose.model('professeurs', professeur);

module.exports = Professeurdb; 
