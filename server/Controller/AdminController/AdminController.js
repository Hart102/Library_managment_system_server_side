const { ObjectId } = require('mongodb');
const {adminAuth} = require('../../module/Joi/Joi');
const { db } = require('../NewDataBase/DatabaseConnection');


let session;
const adminAuthentication = () => { // admin loginId = 1234
    return{
        // -----------Admin Login Route-----------
        adminLogin(req, res){
            const { error, value } = adminAuth.validate(req.body)
            if(error){
                res.json({error: error.message})
            }else{
                db.collection('admin').findOne({ 
                    adminId: value.adminId 
                }).then(result => 
                {
                    if(result !== null) return session = req.session.admin = result
                    return res.json({error: 'Invalid login detail'})
                })
            }
        },


        // ------Admin Session------
        adminSession(req, res){res.json({success: session})},

        // ------Reset password------
        resetPassword(req, res) {
            const { _id, newId } = req.body
            // db.collection('admin').updateOne({ _id: ObjectId }, { $set: { adminId: newId }})
            // .then(response => {
            //     if(response.acknowledged) return res.json({success: "success"})
            //     res.json({error: 'Cannot change password, please try again!'})
            // })

            db.collection('admin').findOne({ _id: ObjectId })
            .then(response => {
                res.json(response)
            })
        }
    }
}

module.exports = {adminAuthentication}

// db.collection('admin').insertOne({ adminId: '1234' }).then(result => console.log(result))




// // Admin Logout Route
// // Admin Reset Password