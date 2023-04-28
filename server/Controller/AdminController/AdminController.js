const {adminAuth} = require('../../module/Joi/Joi')
const { SELECT_ADMIN, dbconn } = require('../../module/Query/QueryString')

const getSession = () => {
    return{
        
    }
}
const adminAuthentication = () => {
    const adminSession = (id) => this.id = id
    return{
        // -----------Admin Login Route-----------
        adminLogin(req, res){
            const { error, value } = adminAuth.validate(req.body)
            if(error){
                res.json({error: error.message})
            }else{
                dbconn.query(SELECT_ADMIN(value.adminId), (error, response) => {
                    if(!error){
                        if(response.length < 1){
                            res.json({error: 'Invalid login credential'})
                        }else{
                            // Create Session Here 
                            req.session.admin = response
                            return new adminSession(req.session.admin)
                        }
                    }else{
                        res.json({error: error})
                    }
                })
            }
        },
        // ------Admin Session------
        adminSession(req, res){res.json(adminSession)}
    }
}

module.exports = {adminAuthentication}

// INSERT INTO `Admin` (`id`, `adminId`) VALUES (NULL, '123')



// // Admin Logout Route
// // Admin Reset Password