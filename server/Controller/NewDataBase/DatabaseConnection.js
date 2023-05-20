const { MongoClient } = require('mongodb')
const uri = "mongodb+srv://library:123@cluster0.h2m6wq5.mongodb.net";

const client = new MongoClient(uri)

// Connect to database
client.connect()
    .then(() => {
        console.log('Connected Successfully!')
        //Close the database connection
        // console.log('Exiting..')
        // client.close()
    })
.catch(error => console.log('Failed to connect!', error))
const db = client.db('Library');

module.exports = { db }