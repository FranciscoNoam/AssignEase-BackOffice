let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let ProfesseurSchema = Schema({
    id: Number,
    nom: String,
    prenom : String,
    photo: String,
});

ProfesseurSchema.plugin(mongoosePaginate);

module.exports =   mongoose.model('professeurs',ProfesseurSchema)