const configUpload = () => {
    return {
        "matiere" : {
            "diskStorage" : "./uploads/img/matiere/"
        },
        "professeur" : {
            "diskStorage" : "./uploads/img/professeur/" 
        },
        "auteur" : {
            "diskStorage" : "./uploads/img/auteur/" 
        }
    }
}

module.exports = {
    configUpload
}

