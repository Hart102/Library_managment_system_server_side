const { db } = require("../NewDataBase/DatabaseConnection");

const lend_book_function = () => {
    return{
        
        check_borrowing_limit (){ // check borrowing limit of member
            db.collection('members').findOne({RegNo: req.body.RegNo}).then(result => 
            {
                if(result){
                    return result
                    if (Number(result.borrowing_limit) < 4) return ({success: true, data: result})
                    return ({error: false})

                }else{
                    return({error: "Member not found"})
                }
            })
        },

        lend_books (req, res){
            console.log(lend_book_function().check_borrowing_limit)
        }
        










        // lend book to memeber if eligible
        // return book from member and update the member book array 
    }
}

module.exports = { lend_book_function }

