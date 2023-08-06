const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors');
require('dotenv').config();
const appWriteImageUpload = require('node-appwrite');
const multer = require('multer')
const { imageUpload } = require('./module/FileUploader/uploadFile');

const ADMINCONTROLLER = require('./Controller/AdminController/AdminController')
const MEMBERSCONTROLLER = require('./Controller/membersController')
const BOOKSCONTROLLER = require('./Controller/BooksController/booksController');



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


// -------------Admin Route-------------
app.post('/api/adminLogin', ADMINCONTROLLER.adminLogin);
app.get('/api/adminLogin', ADMINCONTROLLER.InitializeAdminSession);
app.post('/api/adminPasswordReset', ADMINCONTROLLER.adminPasswordReset);
app.get('/api/admin/destroySession', ADMINCONTROLLER.destroySession);


// ------------Member Route------------
app.get('/api/getAllMembers', MEMBERSCONTROLLER.getAllMembers);
app.post('/api/membersRegistration', imageUpload.single('file'), MEMBERSCONTROLLER.membersRegistration);
app.post('/api/editMembersProfile', imageUpload.single('file'), MEMBERSCONTROLLER.editMembersProfile);
app.post('/api/deleteMember', MEMBERSCONTROLLER.deleteMember);


// ---------Book controller Route--------- 
app.get('/api/getAllBooks', BOOKSCONTROLLER.getAllBook)
app.post('/api/registerBooks',  imageUpload.single('file'), BOOKSCONTROLLER.registerBooks)
app.post('/api/editBook', imageUpload.single('file'), BOOKSCONTROLLER.editBook)
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
