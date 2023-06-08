const { db } = require("../NewDataBase/DatabaseConnection");
const { ObjectId } = require('mongodb');

// userId: 646809c89002c9f6314576b0
// Book Id: 64790191a0add8b7258559b2


// class BookObect {
//     constructor(publishers, title, edition, publishDate, pages, description, category, cover, quantity,) {
//         this.publishers = publishers
//         this.title = title
//         this.edition = edition
//         this.publishDate = publishDate
//         this.pages = pages
//         this.description = description
//         this.category = category
//         this.cover = cover
//         this.quantity = quantity
//     }
// }
 
// let book = new BookObect(
//     ['Mr. Kelvin'],
//     'science',
//     'An edition of Fantastic Mr Fox (1970)',
//     'October 1, 1950',
//     '96',
//     'The main character of Fantastic Mr. Fox is an extremely clever anthropomorphized fox named Mr. Fox. He lives with his wife and four little foxes. In order to feed his family, he steals food from the cruel, brutish farmers named Boggis, Bunce, and Bean every night.',
//     'science and technology',
//     'coverImage.png',
//     30,
// )

const errMsg = 'Something went wrong please try again.';
const SERVER_ERROR = 'Server Error!'

const borrowed_date = () => {
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth();
    let year = objectDate.getFullYear();
    let date = day + "-" + month + "-" + year;
    return date
}




// Book registration route
const registerBooks = (req, res) => 
{
    db.collection('books').insertOne(req.body).then(result => 
    {
        if(result.acknowledged)
            return res.json({ success: 'Registration successful' });
        res.json({ error: 'Book not registered try again!' });
    }).catch(err => res.json({error: errMsg}));
}






const assignKeyValueToObject = (obj, key, value) => {
    obj[key] = value;
    return obj;
}


const findObjectById = (array, id) => {
    if(array && id){
        return array.find(object => object.id === id);
    }
}


/*
    LEND OR BORROW BOOK FUNCTION

    FEATURES:

    1) This route check if the a member have gotten to his/her borrowing limit
    before it borrows book to members. 
    2) Check if member already have the requested book in his/her custody.
    3)It adds book requested by a member to the member's borrowing record,
    and also reduces the total number of that particular book the member borrowed. 
*/
const lend_books = (req, res) => {
    try {
        const { regNo, bookId, bookReturningDate } = req.body

        db.collection('members').findOne({ RegNo: regNo }).then(member => 
        {
            if(member){
                if(member.borrowed_books.length > 3) { // check borrowing limit
                    res.json({error: "you've reached your borrowing limit!"})

                }else{
                    const findBookInMembersRecord = findObjectById(member.borrowed_books, bookId);
                    if(findBookInMembersRecord){
                        res.json({msg: 'Book already in your custody'});

                    }else{
                        db.collection('books').findOne({ _id: new ObjectId(bookId) }).then(book => 
                        {
                            if(book){
                                book = assignKeyValueToObject(book, 'borrowedDate', borrowed_date()), 
                                assignKeyValueToObject(book, 'bookReturningDate', bookReturningDate);

                                member.borrowed_books.push(book) //Update member borrowing list
                                db.collection('members').replaceOne({ RegNo: regNo }, member).then(result => 
                                {
                                    if(result.modifiedCount > 0) {
                                        // Reduce the total number of books in the database
                                        db.collection('books').updateOne( { _id: new ObjectId(bookId) }, { $inc: { totalNumber: -1 } }).then(book => 
                                        {
                                            if (book.modifiedCount > 0) return res.json({success: "Book successfully borrowed."})
                                            res.json({error: 'Book not borrowed try again.'})
                                        })
                                    }
                                }).catch(err => res.json({error: errMsg}));

                            }else{
                                res.json({error: 'book not found'});
                            }                         
                        }).catch(err => res.json({error: errMsg}));
                    }
                }
            }
        }).catch(err => res.json({error: errMsg}));
    } catch (error) {
        res.json({error: SERVER_ERROR})
    }
}


/*
    RETURN BOOK FUNCTION
    This route removes the book returned by a member from the members borrowing record
    and also increase the total number of that particular book the member returned. 
*/
const returnBooks = (req, res) => { 
    const { regNo, bookId } = req.body
    try {
        db.collection('members').findOne({ RegNo: regNo }).then(member => 
        {
            if(member){ // Removing book from user history
                if(member.borrowed_books.length < 1){
                    res.json({error: "No book in member's custody"})

                }else{
                    member.borrowed_books.splice(member.borrowed_books.findIndex(book => book.id === bookId) , 1);
    
                    db.collection('members').updateOne({ RegNo: regNo }, { $set: { borrowed_books: member.borrowed_books } }).then(response => 
                    {
                        if(response.modifiedCount > 0){
                            db.collection('books').updateOne({ _id: new ObjectId(bookId) }, { $inc: { 'totalNumber' : 1 } }).then(response => 
                            {
                                if(response.modifiedCount > 0){
                                    return res.json({
                                        success: `${member.FullName}, thank you for returning the book in your custody`
                                    });
                                }
                            }).catch(err => res.json({error: errMsg}));
                        }
                    }).catch(err => res.json({error: errMsg}));
                }
            }else{res.json({error: 'Member not found!'})}

        }).catch(err => res.json({error: errMsg}));
    } catch (error) {res.json({error: SERVER_ERROR})}
}
  

// Get all books from database
const getAllBook = (req, res) => 
{
    try {
        db.collection('books').find({}).toArray().then(books => 
        {
            if(books.length > 0) return res.json({success: books});
            res.json({error: 'No book found!'});
        }).catch(err => res.json({error: errMsg}));
    } catch (error) {res.json({error: SERVER_ERROR})}   
}


// Delete book from database
const deleteBook = (req, res) =>
{
    db.collection('books').deleteOne({ _id: new ObjectId(req.body.bookId)}).then(response => 
    {
        if(response.deletedCount > 0) return res.json({success: "Book deleted"})
    }).catch(err => res.json({error: errMsg}));
}



// Edit book 
const editBook = (req, res) => 
{
    try {
        const { bookId, publisher, title, edition,
            publishedDate, pages, description, category, 
            coverImage, totalNumber
        } = req.body;
    
        db.collection('books').updateOne(
            { _id: new ObjectId(bookId) },
            { $set: 
                {
                    publisher: publisher,
                    title: title,
                    edition: edition,
                    publishedDate: publishedDate,
                    pages: pages,
                    description: description,
                    category: category,
                    coverImage: coverImage,
                    totalNumber: Number(totalNumber)
                }
            }
        ).then(response => 
        {
            if(response.modifiedCount > 0){
                res.json({success: 'Book Edited'})
            }else{res.json({error: 'Something went wrong please try again'})}
        }).catch(err => res.json({error: errMsg}));
        
    } catch (error) {
        res.json({error: SERVER_ERROR});
    }
}









module.exports = { 
    lend_books, 
    registerBooks,
    returnBooks,
    getAllBook,
    deleteBook,
    editBook
}

// Best function for searching books either by using the title or category
// db.collection('books').find({ 
//     "$or": [ { "title": data }, { "category": data } ]
// }).toArray().then(result => result.length > 0 ? res.json({success: result}) : res.json({error: 'no result found!'})
// ).catch(err => res.json({error: errMsg}))
