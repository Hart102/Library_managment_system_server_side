const multer = require('multer')
const path = require('path')
const appWriteImageUpload = require('node-appwrite');


// APPWRITE IMAGE UPLOAD. CLOUD STORAGE FOR STORING IMAGES
// --------------------------------
const uploadApiKey = 
"c3ffa1f1bfb55bad74575cd40024a9d28fca831762ac1600e58c219a23d72ab3fd0315fad984c1ca604a3d0c27416aa9c92a14df1f3f138fff2af8040664f3c0359bdbe5569d9f141ab21abe6549168e3bac5ff43511c7fcdb746231d7c11fdc2fc5eb3da8d99ddd95fb0ee0ae7eb791645ba1dfee153c8214e342fd4aa9b3b4"

const client = new appWriteImageUpload.Client();
const storage = new appWriteImageUpload.Storage(client);

client.setEndpoint('https://cloud.appwrite.io/v1').setProject("64ccf1918044338333a8").setKey(uploadApiKey)

const Upload = multer.memoryStorage();
const imageUpload = multer({ storage: Upload })
// -------------------------------------

module.exports = {
    uploadApiKey,
    storage,
    imageUpload
}















// const multer = require('multer')

// var storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//        cb(null, 'public')
//    },
//    filename: function (req, file, cb) {
//        cb(null, Date.now() + '-' + file.originalname)
//    }
// })

// const upload = multer({ storage: storage }).single('file')
// module.exports = { upload }