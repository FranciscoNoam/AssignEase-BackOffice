const mongoose = require("mongoose")
const config = require("../../config/configuration");
const fs = require("fs");

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
    const date = new Date(dateStr);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; 
    const year = date.getUTCFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
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