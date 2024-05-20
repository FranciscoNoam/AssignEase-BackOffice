const mongoose = require("mongoose")
const config = require("../../config/configuration");
const fs = require("fs");
const moment = require('moment');

const sectionFile = (section )=>{
    return config.configUpload()[section];
}

const getCount = (collection)=>{
    return collection.countDocuments();
}

const makeId = (id)=>{
    return new mongoose.Types.ObjectId(id);
}

const makeDate = (dateStr)=>{
    let formattedDate = dateStr;
    if (isDateValid(dateStr)) {
        const date = new Date(dateStr);
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1; 
        const year = date.getUTCFullYear();
        formattedDate = `${day}-${month}-${year}`;
    }
    return formattedDate;
}

const isDateValid = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}.\d{3}Z)?$/;
    return regex.test(dateStr);
}

const verifyFolderUpload = (req, res, next) => {
    const path = sectionFile( req.params.section)["diskStorage"] 
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true })
    }
    next();
}

const deleteImageFile = (section , file)=>{
    const diskStorage = sectionFile(section)['diskStorage'];
    const imagePath = `${diskStorage}/${file}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }else{
      console.log("Non exist path "+section ,imagePath);
    }
}


module.exports = {
    getCount,
    makeId,
    makeDate,
    verifyFolderUpload,
    sectionFile,
    deleteImageFile
}