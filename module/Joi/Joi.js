const Joi = require('joi')

const adminAuth = Joi.object().keys({
    password: Joi.any().required()
})

const memberRegistrationAuth = Joi.object().keys({
    id: Joi.any(),
    Profile: Joi.any().required(),
    FullName: Joi.string().required(),
    RegNo: Joi.string().required(),
    Department: Joi.string().required(),
    College: Joi.string().required(),
    YearOfAdmission: Joi.string().required(),
    Email: Joi.string().email().required(),
});

const registerBooksAuth = Joi.object().keys({
    file: Joi.any(),
    id: Joi.any(),
    isbn: Joi.string().required(),
    title: Joi.string().required(),
    length: Joi.string().required(),
    author: Joi.string().required(),
    edition: Joi.string().required(),
    subject: Joi.string().required(),
    publisher: Joi.string().required(),
    totalBooks: Joi.string().required(),
    description: Joi.string().required(),
    oldFileName: Joi.any(),
})

module.exports = {
    adminAuth,
    memberRegistrationAuth,
    registerBooksAuth
}