const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors');
require('dotenv').config();
const appWriteImageUpload = require('node-appwrite');
const multer = require('multer')

const ADMINCONTROLLER = require('./Controller/AdminController/AdminController')
const MEMBERSCONTROLLER = require('./Controller/membersController')
const BOOKSCONTROLLER = require('./Controller/BooksController/booksController');
// const imageUpload = require('./module/FileUploader/uploadFile')
// const Database = require("../NewDataBase/DatabaseConnection");
const Database = require('./Controller/NewDataBase/DatabaseConnection')



const app = express()
const expDate = 60 * 60 * 1000 * 24; // 1 hour 1 day

app.use(session({
    name: "Library",
    secret: '123',
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: expDate,
        secure: false,
        sameSite: true // 'strict'
    }
}))


// app.use(Origin)
app.use(cors({
    origin: '*'
}));
app.use(express.json({ limit: '50mb' }));



// --------------------------------
const uploadApiKey = "c3ffa1f1bfb55bad74575cd40024a9d28fca831762ac1600e58c219a23d72ab3fd0315fad984c1ca604a3d0c27416aa9c92a14df1f3f138fff2af8040664f3c0359bdbe5569d9f141ab21abe6549168e3bac5ff43511c7fcdb746231d7c11fdc2fc5eb3da8d99ddd95fb0ee0ae7eb791645ba1dfee153c8214e342fd4aa9b3b4"

const client = new appWriteImageUpload.Client();
const storage = new appWriteImageUpload.Storage(client);

client.setEndpoint('https://cloud.appwrite.io/v1').setProject("64ccf1918044338333a8").setKey(uploadApiKey)

const Upload = multer.memoryStorage();
const imageUpload = multer({ storage: Upload })
// -------------------------------------

app.post('/api/imageUpload', imageUpload.single('file'), (req, res) => {

    if (req.file) {
        const img = req.file
        const  imageId = 
            img.originalname.replace(/[^a-z^A-Z]/g, "").length > 20 ? img.originalname.replace(/[^a-z^A-Z]/g, "").slice(0, 20) : img.originalname.replace(/[^a-z^A-Z]/g, "")
            
        const promise = 
            storage.createFile("booksUpload", imageId, appWriteImageUpload.InputFile.fromBuffer(img.buffer, img.originalname))

        promise.then(function(response) {
            if(response.chunksUploaded == 1){ //if Successful

                req.body = {...req.body, filename: response.$id, count: 0, id: Math.random()}
                // console.log(req.body)

                Database.Book_collection.insertOne(req.body).then(response => {

                    if (response.acknowledged) {
                        return res.json({
                            success: 'Book successfully registered.'
                        });
                    }
    
                    res.json({
                        error: 'Book not registered try again!'
                    });
                })
                
            }
        })
    }
})



// -------------Admin Route-------------
app.post('/api/adminLogin', ADMINCONTROLLER.adminLogin);
app.get('/api/adminLogin', ADMINCONTROLLER.InitializeAdminSession),
    app.post('/api/adminPasswordReset', ADMINCONTROLLER.adminPasswordReset),
    app.get('/api/admin/destroySession', ADMINCONTROLLER.destroySession),


    // ------------Member Route------------
    app.get('/api/getAllMembers', MEMBERSCONTROLLER.getAllMembers);
app.post('/api/membersRegistration', MEMBERSCONTROLLER.membersRegistration);
app.post('/api/editMembersProfile', MEMBERSCONTROLLER.editMembersProfile);
app.post('/api/deleteMember', MEMBERSCONTROLLER.deleteMember);


// ---------Book controller Route--------- 
app.get('/api/getAllBooks', BOOKSCONTROLLER.getAllBook)
app.post('/api/registerBooks', BOOKSCONTROLLER.registerBooks)
app.post('/api/editBook', BOOKSCONTROLLER.editBook)
app.post('/api/deleteBook', BOOKSCONTROLLER.deleteBook)
app.post('/api/lendBooks', BOOKSCONTROLLER.lend_books)
app.post('/api/returnBooks', BOOKSCONTROLLER.returnBooks)
app.post('/api/searchBook', BOOKSCONTROLLER.searchForBooksUsingTitleOrCategory)
// app.get('/api/getFiles', BOOKSCONTROLLER.getFiles)




app.listen(3000, () => console.log('App running on port 8000'))




















// // Book Regitration Route
// // Fetch All Book
// // Fetch Signle Book
// // Delete Book
// // Reduce or Add number of Books when borrowed or Returned 

// // Lend Books to Students after checking their Borrowing Limit
// // Send email Notification to sudents who are in possession of books
