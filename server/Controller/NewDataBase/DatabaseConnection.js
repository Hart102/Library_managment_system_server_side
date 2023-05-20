const { MongoClient } = require('mongodb')
const uri = "mongodb+srv://library:123@cluster0.h2m6wq5.mongodb.net";

const client = new MongoClient(uri)
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