const { upload } = require('../module/FileUploader/uploadFile')
const { memberRegistrationAuth } = require('../module/Joi/Joi')
const { db } = require('./NewDataBase/DatabaseConnection')


const members = () => {
    return{
        // ----------------Register members----------------
        membersResitration(req, res){ 
            const { error, value } = memberRegistrationAuth.validate(req.body)

            if(error){
                return res.json({error: error})
            }else{
                const new_member = { ...value, borrowing_limit: 4, borrowed_books: [] }
                db.collection('members').insertOne(new_member).then(result => 
                {
                    if(result.acknowledged){
                        res.json({success: 'member registered'})
                        upload(req, res, (err) => err ? console.log({error: err}) : console.log({success: 'File uploaded'}))//Save profile picture
                    }else{
                        res.json({error: 'Something went wrong please try again'})
                    }
                })   
            }
        },


        // -------------------Fetch All members-------------------
        getAllMembers(req, res){ 
            db.collection('members').find({}).toArray().then(result => 
            {
                if (result.length > 0) return res.json({success: result})
                res.json({error: "No member registered yet!"})
            })
        },


        // ---------------Fetch Single member By Registration number---------------
        getSignleMember(req, res){ 
            db.collection('members').findOne({RegNo: req.body.regNo}).then(result => 
            {
                if(result) return res.json({success: result})
                res.json({error: "Member not found"})
            })
        },


        // ------------------Edit members profile------------------
        editMembersProfile(req, res){ 
            const { 
                FullName, 
                RegNo, 
                Department, 
                College, 
                YearOfGraduation,
                Email, 
                borrowing_limit, 
                borrowed_books 
            } = req.body

            db.collection('members').updateOne(
            { RegNo: RegNo }, 
            { $set: 
                { 
                    FullName: FullName,
                    RegNo: RegNo,
                    Department: Department,
                    College: College,
                    YearOfGraduation: YearOfGraduation,
                    Email: Email, 
                    borrowing_limit: borrowing_limit, 
                    borrowed_books: borrowed_books 
                } 
            }).then(result => 
            {
                if(result.acknowledged) return res.json({success: "Profile updated"})
                res.json({error: "Could not update profile, try again!"})
            })
        }
    }
}

module.exports = {members}










// mongodb connection string 

// mongodb+srv://library:<123>@cluster0.h2m6wq5.mongodb.net/



// db.collection('members').findOne({FullName: "Goodluck chikanma Nnamdi"}).then(result => {
//     console.log(result)
// })

// db.collection('members').deleteMany({}).then(result => {
//     console.log(result)
// })