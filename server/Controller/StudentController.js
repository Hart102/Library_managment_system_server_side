const { upload } = require('../module/FileUploader/uploadFile')
const { studentRegistrationAuth } = require('../module/Joi/Joi')
const { 
    createStudent,
    getAllStudents, 
    getSignleStudent,
    editStudentData,
    dbconn 
} = require('../module/Query/QueryString')


const convertToLowerCase = str => str.toLowerCase()

const studentFunction = () => {
    return{
        // ----------------Register students----------------
        registerStudents(req, res){ 
            const { error, value } = studentRegistrationAuth.validate(req.body)
            if(error) {
                res.json(error.message)
            }else{
                dbconn.query(
                    createStudent, 
                    [convertToLowerCase(value.FullName), convertToLowerCase(value.RegNo), convertToLowerCase(value.Department), 
                    convertToLowerCase(value.College), convertToLowerCase(value.YearOfGraduation), convertToLowerCase(value.Email), 4, ''],
                    (err, response) => {
                        if(!err) {
                            res.json({success: 'Student registered'})
                            upload(req, res, (err) => err ? console.log({error: err}) : console.log({success: 'File uploaded'}))
                        }else{
                            res.json({error: 'Something went wrong please try again'}) 
                        }
                    }
                )
            }
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
        editStudentData(req, res){ 
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