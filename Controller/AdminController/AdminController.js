const { ObjectId } = require('mongodb');
const { adminAuth } = require('../../module/Joi/Joi');
const Database = require("../NewDataBase/DatabaseConnection");



let session;
const SERVER_ERROR = 'Network timeout please try again!';

// Admin login route 
const adminLogin = async (req, res) => // admin loginId = 1234
{
    try {
        const { error, value } = adminAuth.validate(req.body);
        if (error) return res.json({ error: error.message });

        const admin = await Database.Admin_collection.findOne({ password: value.password });
        if (admin !== null) {
            return session = req.session.admin = admin;
        } else {
            res.json({ error: 'Invalid password' });
        }
    } catch (error) {
        res.json({ error: SERVER_ERROR });
    }
}

// Session Route 
const InitializeAdminSession = async (req, res) => {
    try {
        session ? res.json({ success: session }) : res.json({ error: 'No session' });
    } catch (error) {
        res.json({ error: SERVER_ERROR });
    }
}

// Admin reset password
const adminPasswordReset = async (req, res) => // Admin LoginId: 64826bcd0997ddfb04da5d34
{
    try {
        const { id, newPassword } = req.body;
        if (!newPassword) return res.json({ error: 'Cannot set login Id to empty' });

        const resetLoginId = await Database.Admin_collection.updateOne(
            { _id: new ObjectId(id) }, { $set: { password: newPassword } }
        );

        if (resetLoginId.modifiedCount > 0) {
            res.json({ success: "Password reset successful" });
        } else {
            res.json({ error: 'Could not reset password' })
        }
    } catch (error) {
        res.json({ error: SERVER_ERROR });
    }
}


const destroySession = (req, res) => {
    try {
        req.session.destroy(); return session = '';
    } catch (error) {
        res.json({ error: SERVER_ERROR });
    }
}


module.exports = {
    adminLogin, adminPasswordReset,
    InitializeAdminSession, destroySession
}