const getCount = (collection)=>{
    return collection.countDocuments();
}

module.exports = {
    getCount
}