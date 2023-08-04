const multer = require('multer')
const { ObjectId } = require('mongodb');
const { upload } = require('../module/FileUploader/uploadFile')

const Database = require("./NewDataBase/DatabaseConnection");
const { memberRegistrationAuth } = require('../module/Joi/Joi')


// Reusable server message 
const NETWORK_ERROR = 'Network timeout! please try again.'

// Get all member 
const getAllMembers = async (req, res) => {
    try {
        const members = await Database.Members_collection.find({}).toArray();
        if (members) return res.json({ success: members });

    } catch (error) {
        res.json({ error: NETWORK_ERROR });
    }
}

// Register member 
const membersRegistration = (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ error: err })

            } else if (err) {
                return res.status(500).json({ error: err })

            } else {
                let { error, value } = memberRegistrationAuth.validate(req.body);
                if (error) {
                    return res.json({ error: error.message });

                } else {
                    delete value.id
                    value = { ...value, books: [] }
                    const insertNewMember = await Database.Members_collection.insertOne(value)

                    if (insertNewMember.acknowledged) {
                        res.json({
                            success: "Member's profile created successfully"
                        });

                    } else {
                        res.json({
                            error: 'Registration number already exist'
                        });
                    }
                }
            }
        })
    } catch (error) {
        res.json({ error: NETWORK_ERROR });
    }
}

// Database.Members_collection.find({})
const editMembersProfile = async (req, res) => {
    try {

        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ error: err })

            } else if (err) {
                return res.status(500).json({ error: err })

            } else {
                const { id, Profile, RegNo, Email, College, FullName, Department, YearOfAdmission } = req.body;
                const updateProfile = await Database.Members_collection.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $set:
                        {
                            RegNo: RegNo,
                            Email: Email,
                            Profile: Profile,
                            College: College,
                            FullName: FullName,
                            Department: Department,
                            YearOfAdmission: YearOfAdmission
                        }
                    }
                )

                if (updateProfile.modifiedCount > 0) {
                    return res.json({
                        success: "profile updated"
                    });
                }
                res.json({
                    error: "No new changes to apply"
                });
            }
        })
    } catch (error) {
        res.json({ error: NETWORK_ERROR });
    }
}

const deleteMember = async (req, res) => {
    try {
        const response =
            await Database.Members_collection.deleteOne({ _id: new ObjectId(req.body.id) })
        if (response.deletedCount > 0) return res.json({ success: "Record delete Successfully" })
        res.json({ error: 'Problem occured while deleting record' })

    } catch (error) {
        res.json({ error: NETWORK_ERROR })
    }
}

module.exports = {
    getAllMembers,
    membersRegistration,
    editMembersProfile,
    deleteMember
}
