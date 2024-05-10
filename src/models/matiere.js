let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let MatiereSchema = Schema({
    id: Number,
    nom: String,
    image: String,
    prof : Number
});

MatiereSchema.plugin(mongoosePaginate);

module.exports =  mongoose.model('matieres',MatiereSchema)