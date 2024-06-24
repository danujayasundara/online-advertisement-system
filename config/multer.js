const multer = require('multer');  //for upload files
const path = require('path');

const storage = multer.diskStorage({  //where store uploaded images
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  //null - no error
    },
    filename: function (req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);  //ensures that each file has a unique name.
        cb(null, file.fieldname + '_' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage});

module.exports = upload;