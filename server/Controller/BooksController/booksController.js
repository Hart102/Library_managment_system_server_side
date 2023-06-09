const { ObjectId } = require('mongodb');
const Database = require("../NewDataBase/DatabaseConnection");
const helperFunction = require("../../module/Helper/helperFunction");



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

const SERVER_ERROR = 'Server Error!'


// Book registration route
const registerBooks = async (req, res) => 
{
    try {
        const insertBook = await Database.Book_collection.insertOne(req.body);
        if(insertBook.acknowledged) return res.json({success: 'Book successfully registered.'});
        res.json({ error: 'Book not registered try again!' });
        
    } catch (error) {
        res.json({error: SERVER_ERROR});
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
const lend_books = async (req, res) => 
{
    try {
        const { regNo, bookId, bookReturningDate } = req.body;
        const member = await Database.Members_collection.findOne({ RegNo: regNo });

        if(member){
            if(member.borrowed_books.length > 3) { // check borrowing limit
                res.json({error: "you've reached your borrowing limit!"});

            }else{
                const findBookInMembersRecord = helperFunction.findObjectById(member.borrowed_books, bookId);
                if(findBookInMembersRecord){
                    res.json({error: `${member.FullName}, the book you want to borrow is already in your custody`});

                }else{
                    let book = await Database.Book_collection.findOne({ _id: new ObjectId(bookId) });
                    if(book){
                        book = helperFunction.assignKeyValueToObject(book, 'borrowedDate', helperFunction.currentDate()), 
                        helperFunction.assignKeyValueToObject(book, 'bookReturningDate', bookReturningDate);

                        member.borrowed_books.push(book) //Add book to member's borrowing record
                        const UpdateMemberRecord = await Database.Members_collection.replaceOne({ RegNo: regNo }, member);

                        if(UpdateMemberRecord.modifiedCount > 0){
                            // Reduce the total number of books this in the database
                            const reduceTotalNumberOfBook = await Database.Book_collection.updateOne( 
                                { _id: new ObjectId(bookId) }, { $inc: { totalNumber: -1 } }
                            );
                            if(reduceTotalNumberOfBook.modifiedCount > 0) return res.json(
                                {success: `Book successfully borrowed to ${member.FullName}`}
                            )
                            res.json({error: 'Failed to lend book to member, please try again.'})
                        }
                    }
                }
            }
        }
    } catch (error) {
        res.json({error: SERVER_ERROR});
    } 
}


/*
    RETURN BOOK FUNCTION
    This route removes the book returned by a member from the members borrowing record
    and also increase the total number of that particular book the member returned. 
*/
const returnBooks = async (req, res) => 
{ 
    try {
        const { regNo, bookId } = req.body;
        const member = await Database.Members_collection.findOne({ RegNo: regNo });

        if(member){
            if(member.borrowed_books.length < 1){
                res.json({error: "No book in member's custody"});

            }else{
                //Remove book from member's borrowing record
                member.borrowed_books.splice(member.borrowed_books.findIndex(book => book.id === bookId) , 1);
                const UpdateMemberRecord = await Database.Members_collection.updateOne(
                    { RegNo: regNo }, { $set: { borrowed_books: member.borrowed_books } }
                );

                if(UpdateMemberRecord.modifiedCount > 0){
                    // Increase the total number of this books in the database
                    const increaseTotalNumberOfBooks = await Database.Book_collection.updateOne(
                        { _id: new ObjectId(bookId) }, { $inc: { 'totalNumber' : 1 } }
                    );

                    if(increaseTotalNumberOfBooks.modifiedCount > 0){
                        res.json({
                            success: `${member.FullName}, thank you for returning the book in your custody`
                        });
                    }
                }       
            }
        }
    } catch (error) {
        res.json({error: SERVER_ERROR})
    }
}
  

// Get all books from database
const getAllBook = async (req, res) => 
{
    try {
        const books = await Database.Book_collection.find({}).toArray();
        if(books.length > 0) return res.json({success: books});
        res.json({error: 'No book found!'});
        
    } catch (error) {
        res.json({error: SERVER_ERROR});
    }
}


// Delete book from database
const deleteBook = async (req, res) =>
{
    try {
        const response = await Database.Book_collection.deleteOne({ _id: new ObjectId(req.body.bookId) })
        if(response.deletedCount > 0) return res.json({success: "Book deleted"})

    } catch (error) {
        res.json({error: SERVER_ERROR})
    }
}



// Edit book 
const editBook = async (req, res) => 
{
    try {
        const { bookId, publisher, title, edition,
            publishedDate, pages, description, category, 
            coverImage, totalNumber
        } = req.body;

        const editedBook = await Database.Book_collection.updateOne(
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
        );

        if(editedBook.modifiedCount > 0) return res.json({success: 'Book Edited'});
        res.json({error: 'Something went wrong please try again'});

    } catch (error) {
        res.json({error: SERVER_ERROR});
    }

    // try {
    //     db.collection('books').replaceOne({ _id: new ObjectId(req.body.id) }, req.body.objectOfReplacement).then(response => {})
    // } catch (error) {
        
    // }
}


//Search for books, using title or category.
const searchForBooksUsingTitleOrCategory = async (req, res) => 
{
    try {
        const { data } = req.body;
        const response = await Database.Book_collection.find({ "$or": [ { "title": data }, { "category": data } ]}).toArray();

        if(response.length > 0) return res.json({success: response});
        res.json({error: 'Book not found'})

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
    editBook,
    searchForBooksUsingTitleOrCategory
}