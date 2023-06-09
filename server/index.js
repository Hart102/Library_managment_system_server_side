const express                      = require('express')
const bodyParser                   = require('body-parser')
const session                      = require('express-session')
const Origin                       = require('./module/AccessOrigin/Origin')

const ADMINCONTROLLER              = require('./Controller/AdminController/AdminController')
const MEMBERSCONTROLLER            = require('./Controller/membersController')
const BOOKSCONTROLLER = require('./Controller/BooksController/booksController')

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


app.use(Origin)
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


// -------------Admin Route-------------
app.post('/api/adminLogin', ADMINCONTROLLER.adminLogin);
app.post('/api/adminPasswordReset', ADMINCONTROLLER.adminPasswordReset),
app.get('/api/admin/createSession', ADMINCONTROLLER.InitializeAdminSession),



// app.post('/api/adminLogin', ADMINCONTROLLER.adminAuthentication().login)
// app.post('/api/resetPassword', ADMINCONTROLLER.adminAuthentication().resetPassword)
// app.get('/api/admin/createSession', ADMINCONTROLLER.adminAuthentication().createSession)
// app.get('/api/admin/destroySession', ADMINCONTROLLER.adminAuthentication().destroySession)


// ------------Student Route------------
app.post('/api/register', MEMBERSCONTROLLER.members().membersResitration)
app.get('/api/getAllMembers', MEMBERSCONTROLLER.members().getAllMembers)
app.get('/api/getSingleMember', MEMBERSCONTROLLER.members().getSignleMember)
app.post('/api/editMemberProfile', MEMBERSCONTROLLER.members().editMembersProfile)


// ---------Book controller Route--------- 
app.post('/api/lendBooks', BOOKSCONTROLLER.lend_books)
app.post('/api/registerBooks', BOOKSCONTROLLER.registerBooks)
app.post('/api/returnBooks', BOOKSCONTROLLER.returnBooks)
app.get('/api/getAllBooks', BOOKSCONTROLLER.getAllBook)
app.post('/api/deleteBook', BOOKSCONTROLLER.deleteBook)
app.post('/api/editBook', BOOKSCONTROLLER.editBook)
app.post('/api/searchBook', BOOKSCONTROLLER.searchForBooksUsingTitleOrCategory)




app.listen(8000, () => console.log('App running on port 8000'))




















// // Book Regitration Route
// // Fetch All Book
// // Fetch Signle Book
// // Delete Book
// // Reduce or Add number of Books when borrowed or Returned 

// // Lend Books to Students after checking their Borrowing Limit
// // Send email Notification to sudents who are in possession of books
