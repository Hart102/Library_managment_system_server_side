const { ObjectId } = require('mongodb');
const {adminAuth} = require('../../module/Joi/Joi');
const { db } = require('../NewDataBase/DatabaseConnection');



let session;
const adminAuthentication = () => { // admin loginId = 1234
    return{
        login(req, res){ // Admin Login Route
            const { error, value } = adminAuth.validate(req.body)
            if(error){
                res.json({error: error.message})
            }else{
                db.collection('admin').findOne({ loginId: value.loginId }).then(result => 
                {
                    if(result !== null){
                        res.json({success: "Success"})
                        return session = req.session.admin = result
                    }
                    return res.json({error: 'Invalid credential'})
                })
            }
        },


        resetPassword(req, res) { // Reset password
            const { id, loginId } = req.body
            db.collection('admin').updateOne(
                { _id: new ObjectId(id) }, 
                { $set: 
                    { loginId: loginId }
                }
            ).then(result => {
                if(result.modifiedCount > 0) return res.json({
                    success: "Password reset successful"
                })
                res.json({
                    error: 'Cannot change password, please try again!'
                })
            })
        },

        createSession(req, res){ //Admin Session
            session ? res.json({success: session}) : res.json({error: 'No session'})
        }, 

        destroySession(req, res){ // Admin Logout Route
            res.json({success: "session destroyed"})
            req.session.destroy(); return session = '';
        },
    }
}

module.exports = {adminAuthentication}

// db.collection('admin').insertOne({ loginId: '12345' }).then(result => console.log(result))
// db.collection('admin').deleteMany({}).then(result => console.log(result))


// db.collection('admin').findOne({ _id: new ObjectId(id) })
// .then(response => {
//     res.json(response)
// })

