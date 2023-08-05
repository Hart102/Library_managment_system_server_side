const { MongoClient } = require('mongodb')
require('dotenv').config();

const uri = "mongodb+srv://library_management:123@cluster0.h2m6wq5.mongodb.net/?retryWrites=true&w=majority"
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
const Admin_collection = db.collection('admin');
const Members_collection = db.collection('students');
const Book_collection = db.collection('books');
const Books_cover = db.collection('book_covers')


module.exports = {
    db,
    client,
    Admin_collection,
    Members_collection,
    Book_collection,
    Books_cover
}