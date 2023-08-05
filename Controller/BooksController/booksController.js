const fs = require('fs');
const path = require('path')
const multer = require('multer')
const appWriteImageUpload = require('node-appwrite');
const { ObjectId } = require('mongodb');
const Database = require("../NewDataBase/DatabaseConnection");
const helperFunction = require("../../module/Helper/helperFunction");
const {
    storage,
    imageUpload
} = require('../../module/FileUploader/uploadFile');
const { registerBooksAuth } = require('../../module/Joi/Joi')

// Location of the files to be deleted 
const location = path.join(__dirname, '../../../library_system/public/uploads');

// Reusable server message 
const SERVER_ERROR = 'Network timeout, please try again!'


// Get all books from database
const getAllBook = async (req, res) => {
    try {
        const books = await Database.Book_collection.find({}).toArray();
        return res.json({ success: books });

    } catch (error) {
        res.json({ error: SERVER_ERROR });
    }
}

// Book registration route
const registerBooks = async (req, res) => {
    try {
        // Server side validation
        let { value, error } = registerBooksAuth.validate(req.body)
        if (error) return res.json({ error: error.message })

        if (req.file) {
            const img = req.file
            //Rename image and remove spaces if the name is greater than 20
            const imageId =
                img.originalname.replace(/[^a-z^A-Z]/g, "").length > 20 ?
                    img.originalname.replace(/[^a-z^A-Z]/g, "").slice(0, 20) :
                    img.originalname.replace(/[^a-z^A-Z]/g, "")

            // Upload image to appwrite
            const promise =
                await storage
                    .createFile("booksUpload", imageId, appWriteImageUpload.InputFile
                        .fromBuffer(img.buffer, img.originalname))

            if (promise.chunksUploaded == 1) {

                req.body = { ...req.body, filename: promise.$id, count: 0, id: Math.random() }
                const insertBook = await Database.Book_collection.insertOne(req.body)

                if (insertBook.acknowledged) {
                    return res.json({
                        success: 'Book successfully registered.'
                    });
                }

                res.json({
                    error: 'Book not registered try again!'
                });
            }
        }

    } catch (error) {
        res.json({ error: SERVER_ERROR });
    }
}





// update book 
const editBook = async (req, res) => {
    try {

        // Validation
        let { value, error } = registerBooksAuth.validate(req.body)
        if (error) return res.json({ error: error.message })


        if (req.file) {
            const img = req.file
            //Rename image and remove spaces if the name is greater than 20
            const imageId =
                img.originalname.replace(/[^a-z^A-Z]/g, "").length > 20 ?
                    img.originalname.replace(/[^a-z^A-Z]/g, "").slice(0, 20) :
                    img.originalname.replace(/[^a-z^A-Z]/g, "")

            // Delete image from appwrite
            // return console.log(req.body.oldFileNamereq.body.oldFileName)
            // const promise = await storage.updateFile("booksUpload", imageId, req.body.oldFileName);
            // return console.log(promise)


            const promise =
                await storage
                    .updateFile("booksUpload", req.body.oldFileName, appWriteImageUpload.InputFile
                        .fromBuffer(img.buffer, img.originalname))


            const {
                id, isbn, title, pages, length, author, edition,
                subject, publisher, totalBooks, description
            } = req.body;

            // Update Record in the database 
            const updateBook = Database.Book_collection.updateOne(
                { id: Number(id) },
                {
                    $set: {
                        isbn: isbn,
                        pages: pages,
                        title: title,
                        author: author,
                        length: length,
                        edition: edition,
                        subject: subject,
                        publisher: publisher,
                        totalBooks: totalBooks,
                        description: description,
                        filename: req.file.filename,
                    }
                }
            )
        }


        // Deleting any file related to the book that is updated, which has already been replaced 
        // updateBook.then((response) => {
        //     // If user provides a new image then replace the old one
        //     if (response.modifiedCount > 0) {
        //         fs.readdir(location, (err, files) => {
        //             if (err) return console.log(err);
        //             files.forEach(file => {
        //                 if (file === req.body.oldFileName) {
        //                     fs.unlink(`${location}/${req.body.oldFileName}`, (err) => {
        //                         if (err) return console.log(err)
        //                         return res.json({ success: 'Update successful' })
        //                     })
        //                 }
        //             });
        //         });
        //     }

        // })




    } catch (error) {
        res.json({ error: SERVER_ERROR });
        console.log(error)
    }
}

// Delete book from database
const deleteBook = async (req, res) => {
    try {
        const { id, filename } = req.body
        const response =
            await Database.Book_collection.deleteOne({ id: Number(id) })
        if (response.deletedCount > 0) {
            // delete image from directory if record is deleted from the database 
            fs.readdir(location, (err, files) => {
                if (err) return console.log(err);

                files.forEach(file => {
                    if (file === filename) {
                        fs.unlink(`${location}/${filename}`, (err) => {
                            if (err) return console.log(err)
                            return res.json({ success: "Book deleted" })
                        })
                    }
                });
            });
        }

    } catch (error) {
        res.json({ error: SERVER_ERROR })
    }
}







/*
    LEND OR BORROW BOOK FUNCTION
    1) This route check if the a member have gotten to his/her borrowing limit
    before it borrows book to members. 
    2) Check if member already have the requested book in his/her custody.
    3)It adds book requested by a member to the member's borrowing record,
    and also reduces the total number of that particular book the member borrowed. 
*/
const lend_books = async (req, res) => {

    try {

        const { regNo, bookId, returningDate } = req.body;
        const member = await Database.Members_collection.findOne({ RegNo: regNo });

        if (member) {
            if (member.books.length == 4) { // check borrowing limit
                res.json({ error: "you've reached your borrowing limit!" });

            } else {
                // check if book already exist in members record 
                const result = member.books.find((book) => book.id == Number(bookId))

                if (result) {
                    return res.json({
                        warning: `${member.FullName}, 
                        the book you want to borrow is already in your custody`
                    });
                }

                let book = await Database.Book_collection.findOne({ id: Number(bookId) });
                if (book) {
                    // Assign current date and returning date to any book a member borrowed 
                    book = { id: book.id, borrowedDate: helperFunction.currentDate(), bookReturningDate: returningDate }

                    member.books.push(book) //Add book to member's books record
                    const UpdateMemberRecord =
                        await Database.Members_collection.replaceOne({ RegNo: regNo }, member);

                    // Increase the total number of a particular borrowed book 
                    if (UpdateMemberRecord.modifiedCount > 0) {
                        const increaseNoOfbooks =
                            await Database.Book_collection.updateOne({ id: Number(bookId) }, { $inc: { count: +1 } });

                        if (increaseNoOfbooks.modifiedCount > 0) return res.json(
                            { success: `Book successfully borrowed to ${member.FullName}` }
                        )
                        res.json({ warning: 'Network error!, please try again.' })
                    }
                }
            }
        }
    } catch (error) {
        res.json({ error: SERVER_ERROR });
    }
}


/*
    RETURN BOOK FUNCTION
    This route removes the book returned by a member from the members borrowing record
    and also increase the total number of that particular book the member returned. 
*/
const returnBooks = async (req, res) => {
    try {
        const { _id, bookId } = req.body;

        const member = await Database.Members_collection.findOne({ _id: new ObjectId(_id) });

        if (member) {
            if (member.books.length < 1) {
                res.json({ error: "No book in member's custody" });

            } else {
                //Remove book from member's borrowing record
                member.books.splice(member.books.findIndex(book => book.id === Number(bookId)), 1);

                const UpdateMemberRecord = await Database.Members_collection.updateOne(
                    { _id: new ObjectId(_id) },
                    { $set: { books: member.books } }
                );

                if (UpdateMemberRecord.modifiedCount > 0) {
                    // Reduce total number of borrowed books when members returns book 
                    const reduceNoOfBooks =
                        await Database.Book_collection.updateOne({ id: Number(bookId) }, { $inc: { count: -1 } });

                    if (reduceNoOfBooks.modifiedCount > 0) {
                        return res.json({
                            success: `${member.FullName}, thank you for returning the book in your custody`
                        });
                    }
                    res.json({
                        error: SERVER_ERROR
                    });
                }
            }
        }
    } catch (error) {
        res.json({ error: SERVER_ERROR })
    }
}


//Search for books, using title or category.
const searchForBooksUsingTitleOrCategory = async (req, res) => {// Not at work
    try {
        const { data } = req.body;
        const response = await Database.Book_collection.find({ "$or": [{ "title": data }, { "category": data }] }).toArray();

        if (response.length > 0) return res.json({ success: response });
        res.json({ error: 'Book not found' })

    } catch (error) {
        res.json({ error: SERVER_ERROR });
    }
}


module.exports = {
    lend_books,
    registerBooks,
    returnBooks,
    getAllBook,
    deleteBook,
    editBook,
    searchForBooksUsingTitleOrCategory,
}



// const editBook = async (req, res) => {
//     try {
//         upload(req, res, (err) => {
//             if (err instanceof multer.MulterError) {
//                 return res.status(500).json({ error: err })

//             } else if (err) {
//                 return res.status(500).json({ error: err })

//             } else {
//                 // Validation
//                 let { value, error } = registerBooksAuth.validate(req.body)
//                 if (error) return res.json({ error: error.message })


//                 const {
//                     id, isbn, title, pages, length, author, edition,
//                     subject, publisher, totalBooks, description
//                 } = req.body;

//                 // Update Record in the database 
//                 const updateBook = Database.Book_collection.updateOne(
//                     { id: Number(id) },
//                     {
//                         $set: {
//                             isbn: isbn,
//                             pages: pages,
//                             title: title,
//                             author: author,
//                             length: length,
//                             edition: edition,
//                             subject: subject,
//                             publisher: publisher,
//                             totalBooks: totalBooks,
//                             description: description,
//                             filename: req.file.filename,
//                         }
//                     }
//                 )

//                 // Deleting any file related to the book that is updated, which has already been replaced 
//                 updateBook.then((response) => {
//                     // If user provides a new image then replace the old one
//                     if (response.modifiedCount > 0) {
//                         fs.readdir(location, (err, files) => {
//                             if (err) return console.log(err);
//                             files.forEach(file => {
//                                 if (file === req.body.oldFileName) {
//                                     fs.unlink(`${location}/${req.body.oldFileName}`, (err) => {
//                                         if (err) return console.log(err)
//                                         return res.json({ success: 'Update successful' })
//                                     })
//                                 }
//                             });
//                         });
//                     }

//                 })

//             }
//         })


//     } catch (error) {
//         res.json({ error: SERVER_ERROR });
//     }
// }