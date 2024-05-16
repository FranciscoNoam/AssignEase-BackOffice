const makeLookUpAssign = (aggregateQuery) => {

    aggregateQuery.lookup({
        from: 'auteurs', 
        localField: 'auteur',
        foreignField: 'id',
        as: 'auteur'
    });

    aggregateQuery.lookup({
        from: 'matieres', 
        localField: 'matiere',
        foreignField: 'id', 
        as: 'matiere'
    });

   aggregateQuery.unwind('$auteur');
   aggregateQuery.unwind('$matiere');
    
    aggregateQuery.lookup({
        from: 'professeurs', 
        localField: 'matiere.prof',
        foreignField: 'id',
        as: 'matiere.prof' 
    });
    
    aggregateQuery.unwind('$matiere.prof');

}

const makeFilterAssign = (aggregateQuery , filters) => {
    const filterQuery = {};
    filters.forEach(filter => {
        filterQuery[filter.field] = (filter.field === 'rendu' && typeof filter.value === 'boolean') ? filter.value : { $regex: filter.value, $options: 'i' };
    });
    aggregateQuery.match(filterQuery);
}

const makeSortAssign = (aggregateQuery , sorts ) => {
    sorts.forEach(sort => {
        if (sort.field === 'dateDeRendu') {
            aggregateQuery.addFields({
                convertedDateDeRendu: {
                    $dateFromString: {
                        dateString: '$dateDeRendu',
                        format: '%d-%m-%Y'
                    }
                }
            });
            aggregateQuery.sort({convertedDateDeRendu: sort.value});
        } else {
            let sortObject = {};
            sortObject[sort.field] = sort.value;
            aggregateQuery.sort(sortObject);
        }
    });
}

module.exports = {
    makeLookUpAssign,
    makeFilterAssign,
    makeSortAssign
}