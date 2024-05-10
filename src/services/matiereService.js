const joinToProfesseur = (aggregateQuery)=>{

    aggregateQuery.lookup({
        from: 'professeurs', 
        localField: 'prof',
        foreignField: 'id',
        as: 'prof'
    })

    aggregateQuery.unwind('$prof');
}

module.exports = {
    joinToProfesseur
} 