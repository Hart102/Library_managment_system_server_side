const Mysql = require('mysql')

const dbconn = Mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "library"
});
dbconn.connect((err) => {
    if(err) return console.log(err)
    console.log('Connected to database')
})

// -----------Admin Query String-----------
const SELECT_ADMIN = (adminId) => `SELECT * FROM Admin WHERE adminId = '${adminId}'`


// -------Students Table Query String-------
const getAllStudents = `SELECT * FROM students`;
const getSignleStudent = (id) => `SELECT * FROM students WHERE id='${id}'`;
const createStudent = `INSERT INTO students(fullname, regNo, department, college, yearOfGraduation, email, borrowingLimit, borrowedBooks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
const editStudentData = (id, fullname, regNo, department, college, yearOfGraduation, email, borrowingLimit, borrowedBooks) => `UPDATE students SET fullname='${fullname}',regNo='${regNo}',department='${department}',college='${college}',yearOfGraduation='${yearOfGraduation}',email='${email}',borrowingLimit='${borrowingLimit}',borrowedBooks='${borrowedBooks}' WHERE id='${id}'`;


module.exports = {
    SELECT_ADMIN,


    getAllStudents,
    createStudent,
    getSignleStudent,
    editStudentData,
    dbconn
}

// s

