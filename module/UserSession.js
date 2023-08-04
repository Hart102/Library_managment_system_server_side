const session         = require('express-session')
const expDate = 60 * 60 * 1000 * 24; // 1 hour 1 day

const userSession = () => {
    session({
        name: "library",
        secret: '123',
        resave: true,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: expDate,
            secure: false,
            sameSite: true // 'strict'
        }
    })
}

module.exports = userSession