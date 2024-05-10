let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let AuteurSchema = Schema({
    id : Number,
    nom : String,
    photo : String
})

AuteurSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('auteurs',AuteurSchema);