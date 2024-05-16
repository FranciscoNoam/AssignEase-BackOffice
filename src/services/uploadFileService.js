const multer = require('multer');
const config = require("../../config/configuration");
const utilService = require("../services/utils")

const sectionFile = (section )=>{
    return config.configUpload()[section];
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, sectionFile( req.params.section)["diskStorage"] );
    },
    filename: function (req, file, cb) {
        const lastFile = req.body['lastFile'];
        if (lastFile) {
            utilService.deleteImageFile(req.params.section , lastFile);
            console.log(lastFile , "Laste");
        }
        const fileName = req.body['fileName'];
        console.log(fileName , "fileName");
        cb(null, fileName )  ;
    },
});

const upload = multer({
    storage: storage
});


module.exports = {
    upload,
}