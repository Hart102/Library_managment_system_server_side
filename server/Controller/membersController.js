const { upload } = require('../module/FileUploader/uploadFile')

const Database = require("./NewDataBase/DatabaseConnection");
const { memberRegistrationAuth } = require('../module/Joi/Joi')
const helperFunction = require("../module/Helper/helperFunction");


// Reusable server message 
const SERVER_ERROR = 'Server Error!'


const membersRegistration = async (req, res) => 
{
    try {
        let { error, value } = memberRegistrationAuth.validate(req.body);
        if(error){
            return res.json({error: error});
        }else{
            value = helperFunction.assignKeyValueToObject(value, 'borrowed_books', []);
            const insertNewMember = await Database.Members_collection.insertOne(value);

            if(insertNewMember.acknowledged){
                res.json({success: "Member's profile created"});
                // perform a profile image upload here!
                // upload(req, res, (err) => err ? console.log({error: err}) : console.log({success: 'File uploaded'}))
                return
            }
            res.json({error: 'Something went wrong please try again'});
        }
    } catch (error) {
        res.json({error: SERVER_ERROR});
    }
}


const getAllMembers = async (req, res) => 
{
    try {
        const members = await Database.Members_collection.find({}).toArray();
        if(members.length > 0) return res.json({success: members});
        res.json({error: "No member registered yet!"});
        
    } catch (error) {
        res.json({error: SERVER_ERROR});
    }
}


const editMembersProfile = async (req, res) => 
{
    try {
        const { 
            FullName, 
            RegNo, 
            Department, 
            College, 
            YearOfGraduation,
            Email, 
            borrowed_books 
        } = req.body
        
        const EditMemberProfile = await Database.Members_collection.updateOne(
        { RegNo: RegNo }, 
        { $set: 
            { 
                FullName: FullName,
                RegNo: RegNo,
                Department: Department,
                College: College,
                YearOfGraduation: YearOfGraduation,
                Email: Email, 
                borrowed_books: [] 
            } 
        });

        if(EditMemberProfile.modifiedCount > 0){
            return res.json({success: `${FullName}, your profile have been updated`});
        }
        res.json({error: "No new change to be updated in your profile"});

    } catch (error) {
        res.json({error: SERVER_ERROR});
    }
}



module.exports = {
    membersRegistration,
    getAllMembers,
    editMembersProfile
}