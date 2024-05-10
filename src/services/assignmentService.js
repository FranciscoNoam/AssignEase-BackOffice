const makeLookUpAssign = (aggregateQuery) => {

    //Faire une filtre sur l'auteur correspondant
    aggregateQuery.lookup({
        from: 'auteurs', 
        localField: 'auteur',
        foreignField: 'id',
        as: 'auteur'
    });

    //Faire une filtre sur la matiere correspondant
    aggregateQuery.lookup({
        from: 'matieres', 
        localField: 'matiere',
        foreignField: 'id', 
        as: 'matiere'
    });

    // Déconstruire les tableaux produits par les étapes de lookup pour avoir un objet non un tableau
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

module.exports = {
    makeLookUpAssign
}