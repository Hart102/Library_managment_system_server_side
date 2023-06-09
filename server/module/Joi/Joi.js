const Joi = require('joi')

const adminAuth = Joi.object().keys({
    password: Joi.string().required()
})

const memberRegistrationAuth = Joi.object().keys({
    FullName: Joi.string().required(),
    RegNo: Joi.string().required(),
    Department: Joi.string().required(),
    College: Joi.string().required(),
    YearOfGraduation: Joi.string().required(),
    Email: Joi.string().email().required(),
});

module.exports = { 
    adminAuth,
    memberRegistrationAuth
}