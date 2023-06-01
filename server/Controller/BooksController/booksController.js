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
//     ['Mr. Hart', 'Nelson'],
//     'Fantastic Mr. Fox',
//     'An edition of Fantastic Mr Fox (1970)',
//     'October 1, 1988',
//     '96',
//     'The main character of Fantastic Mr. Fox is an extremely clever anthropomorphized fox named Mr. Fox. He lives with his wife and four little foxes. In order to feed his family, he steals food from the cruel, brutish farmers named Boggis, Bunce, and Bean every night.',
//     'Novel',
//     'coverImage.png',
//     '20',
// )

const errMsg = 'please something went wrong.';

const registerBooks = (req, res) => { // Book registration
    db.collection('books').insertOne(req.body).then(result => 
    {
        if(result.acknowledged)
            return res.json({ success: 'registration successful' });
        res.json({ error: 'book not registered try again!' });
    }).catch(err => res.json({error: errMsg}));
}




const lend_books = (req, res) => { // Lend book function
    const { regNo, bookId } = req.body

    db.collection('members').findOne({ RegNo: regNo }).then(member => 
    {
        if(member){ 
            db.collection('books').findOne({ _id: new ObjectId(bookId) }).then(book => 
            {
                if(member.borrowing_limit > 3) { // check borrowing limit
                    res.json({status: "you've reached your borrowing limit!"})
                    return
                }

                let checkBorrowedBooks = member.borrowed_books.find(bookObject => bookObject._id == bookId)

                if(checkBorrowedBooks){
                    res.json({msg: 'Book already in your possession'});

                }else{
                    member.borrowed_books.push(book)
                    db.collection('members').replaceOne({ RegNo: regNo }, member).then(result => {
                        if (result.modifiedCount > 0) return res.json({success: "Book successfully borrowed."})
                        res.json({error: 'Book not borrowed try again.'})
                    }).catch(err => res.json({error: errMsg}));
                }
                
            }).catch(err => res.json({error: errMsg}));
        }

    }).catch(err => res.json({error: errMsg}));
}




// console.log(book)









module.exports = { 
    lend_books, 
    registerBooks 
}

// Best function for searching books either by using the title or category
// db.collection('books').find({ 
//     "$or": [ { "title": data }, { "category": data } ]
// }).toArray().then(result => result.length > 0 ? res.json({success: result}) : res.json({error: 'no result found!'})
// ).catch(err => res.json({error: errMsg}))



