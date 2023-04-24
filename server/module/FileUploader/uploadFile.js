const multer = require('multer')

var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       cb(null, './public/uploads');    
    }, 
    filename: function (req, file, cb) { 
       cb(null , file.originalname);   
    }
});

// inside multer({}), file upto only 1MB can be uploaded
const upload = multer({ storage: storage, limits : {fileSize : 1000000}}).single('file');

module.exports = { upload }