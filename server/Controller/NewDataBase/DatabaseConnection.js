const { MongoClient } = require('mongodb')
require('dotenv').config();

const client = new MongoClient(process.env.DB_CONNECTION_STRING)
client.connect()
    .then(() => {
        console.log('Connected to Mongodb!')
        //Close the database connection
        // console.log('Exiting..')
        // client.close()
    })
.catch(error => console.log('Failed to connect!', error))
const db = client.db('Library');

module.exports = { db }