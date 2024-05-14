const mongoose = require("mongoose")

const getCount = (collection)=>{
    return collection.countDocuments();
}

const makeId = (id)=>{
    return new mongoose.Types.ObjectId(id);
}

const makeDate = (dateStr)=>{
    const date = new Date(dateStr);
    const day = date.getUTCDate()+1;
    const month = date.getUTCMonth() + 1; // Les mois sont 0-indexés, donc ajoutez 1
    const year = date.getUTCFullYear();

    // Formattez la date au format "20 - 12 - 2023"
    const formattedDate = `${day}-${month}-${year}`;

    console.log(formattedDate); 
    return formattedDate;
}

module.exports = {
    getCount,
    makeId,
    makeDate
}