const multer = require('multer');
const config = require("../../config/configuration");

const sectionFile = (section )=>{
    return config.configUpload()[section];
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, sectionFile( req.params.section)["diskStorage"] );
    },
    filename: function (req, file, cb) {
        const matiereParse = JSON.parse(req.body.matiere);
        console.log(matiereParse);
        cb(null, matiereParse.image )  ;
    },
});

const upload = multer({
    storage: storage
});


module.exports = {
    upload,
}