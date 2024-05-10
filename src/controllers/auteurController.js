let Auteur = require('../models/auteur')

const getAuteurs = (req , res)=>{
    let aggregateQuery = Auteur.aggregate();

    Auteur.aggregatePaginate(
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
    getAuteurs
}