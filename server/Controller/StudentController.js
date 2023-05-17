const { upload } = require('../module/FileUploader/uploadFile')
const { studentRegistrationAuth } = require('../module/Joi/Joi')
const { 
    createStudent,
    getAllStudents, 
    getSignleStudent,
    editStudentData,
    dbconn 
} = require('../module/Query/QueryString')
// const sqlite = require('sqlite3').verbose();

// const db = new sqlite.Database('./DataBase/library.db', sqlite.OPEN_READWRITE, (err) => {
//     if (err) return console.log("Connection Error:", err)
// })



// const sql = 'CREATE TABLE `library`.`users` (`id` INT(11) NOT NULL AUTO_INCREMENT , `fullname` VARCHAR(255) NOT NULL , `regNo` VARCHAR(255) NOT NULL , `department` VARCHAR(255) NOT NULL , `college` VARCHAR(255) NOT NULL , `year` VARCHAR(255) NOT NULL , `email` VARCHAR(255) NOT NULL , `borrowingLimit` VARCHAR(255) NOT NULL , `borrowedBooks` VARCHAR(255) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;'

// db.run(sql);


const sqlite3 = require("sqlite3").verbose();
const filepath = "./DataBase/library.db";

// function createDbConnection() {
  const db = new sqlite3.Database(filepath, (error) => {
    if (error) {
      return console.error(error.message);
    }
    // createTable(db);
  });

//   db.exec(
//     `    CREATE TABLE users ( ID INTEGER PRIMARY KEY AUTOINCREMENT, fullname   VARCHAR(50) NOT NULL, regNo   VARCHAR(225) NOT NULL, department VARCHAR(255) NOT NULL, college VARCHAR(255) NOT NULL, year VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, borrowingLimit VARCHAR(255) NOT NULL, borrowedBooks VARCHAR(255) NOT NULL);`
//   )






//   console.log("Connection with SQLite has been established");
//   return db;
// }

// function createTable(db) {
//   db.exec(`
//   CREATE TABLE sharks
//   (
//     ID INTEGER PRIMARY KEY AUTOINCREMENT,
//     name   VARCHAR(50) NOT NULL,
//     color   VARCHAR(50) NOT NULL,
//     weight INTEGER NOT NULL
//   );
// `);
// }











const convertToLowerCase = str => str.toLowerCase()

const studentFunction = () => {
    return{
        // ----------------Register students----------------
        registerStudents(req, res){ 
            const { error, value } = studentRegistrationAuth.validate(req.body)

            if(error){
                return res.json({error: error})
            }else{
                const { FullName, RegNo, Department, College, YearOfGraduation, Email } = value

                // db.run(
                //     createStudent, 
                //     [FullName, RegNo, Department, College, YearOfGraduation, Email], (err, result) => {
                //         if (err) return console.log(err)
                //         console.log(result)
                //     }
                // )
                res.json({success: value})
            }




            // if(error) {
            //     res.json(error.message)
            // }else{
            //     dbconn.query(
            //         createStudent, 
            //         [convertToLowerCase(value.FullName), convertToLowerCase(value.RegNo), convertToLowerCase(value.Department), 
            //         convertToLowerCase(value.College), convertToLowerCase(value.YearOfGraduation), convertToLowerCase(value.Email), 4, ''],
            //         (err, response) => {
            //             if(!err) {
            //                 res.json({success: 'Student registered'})
            //                 upload(req, res, (err) => err ? console.log({error: err}) : console.log({success: 'File uploaded'}))
            //             }else{
            //                 res.json({error: 'Something went wrong please try again'}) 
            //             }
            //         }
            //     )
            // }
        },
        // -------------------Fetch All Students-------------------
        getAllStudents(req, res){ 
            dbconn.query(getAllStudents, (error, result) => {
                !error ? res.json({success: result}) : res.json({error: error}) 
            })
        },
        // ---------------Fetch Single Student By Id---------------
        getSignleStudent(req, res){ 
            dbconn.query(getSignleStudent(req.body.id), (err, result) => {
                err ? res.json({error: err}) : res.json({success: result})
            })
        },
        // ------------------Edit student Datails------------------
        editStudentProfile(req, res){ 
            const { 
                id, 
                FullName, 
                RegNo, 
                Department, 
                College, 
                YearOfGraduation,
                Email, 
                borrowingLimit, 
                borrowedBooks 
            } = req.body
            dbconn.query(
                editStudentData(
                    id, 
                    convertToLowerCase(FullName), 
                    convertToLowerCase(RegNo), 
                    convertToLowerCase(Department), 
                    convertToLowerCase(College), 
                    convertToLowerCase(YearOfGraduation),
                    convertToLowerCase(Email), 
                    convertToLowerCase(borrowingLimit), 
                    convertToLowerCase(borrowedBooks) 
                ), (err, result) => 
                {err ? res.json({error: err}) : res.json({success: result})}
            )
        }
    }
}

module.exports = {studentFunction}