const express                      = require('express')
const bodyParser                   = require('body-parser')
const session                      = require('express-session')
const Origin                       = require('./module/AccessOrigin/Origin')
const AdminController              = require('./Controller/AdminController/AdminController')
const membersController            = require('./Controller/membersController')

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
app.post('/api/adminLogin', AdminController.adminAuthentication().adminLogin)
app.get('/api/admin/session', AdminController.adminAuthentication().adminSession)
app.post('/api/resetPassword', AdminController.adminAuthentication().resetPassword)




// ------------Student Route------------
app.post('/api/register', membersController.members().membersResitration)
app.get('/api/getAllMembers', membersController.members().getAllMembers)
app.get('/api/getSingleMember', membersController.members().getSignleMember)
app.post('/api/editMemberProfile', membersController.members().editMembersProfile)


app.listen(8000, () => console.log('App running on port 8000'))




















// // Book Regitration Route
// // Fetch All Book
// // Fetch Signle Book
// // Delete Book
// // Reduce or Add number of Books when borrowed or Returned 

// // Lend Books to Students after checking their Borrowing Limit
// // Send email Notification to sudents who are in possession of books
