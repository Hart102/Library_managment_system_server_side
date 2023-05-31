const { ObjectId } = require("mongodb");
const { db } = require("../NewDataBase/DatabaseConnection");


const check_borrowing_limit = (regNo) => { // check borrowing limit of member
    // return console.log(regNo)
    return db.collection('members').findOne({ RegNo: regNo }).then(result => {
        if(result) return { status: true, success: result }
        return { status: false }
    })
}

const lend_book_function = () => {
    return{
        
        // check_borrowing_limit (){ // check borrowing limit of member
        //     db.collection('members').findOne({RegNo: req.body.RegNo}).then(result => 
        //     {
        //         if(result){
        //             return result
        //             if (Number(result.borrowing_limit) < 4) return ({success: true, data: result})
        //             return ({error: false})

        //         }else{
        //             return({error: "Member not found"})
        //         }
        //     })
        // },

     

        lend_books (req, res){ // userId: 646809c89002c9f6314576b0
            // return console.log(req.body.RegNo)

            const status = check_borrowing_limit(req.body.RegNo)
            console.log(status)

            // db.collection('members').findOne({ RegNo: req.body.RegNo }).then(result => {
            //     if(result) return console.log({ status: true, success: result })
            //     return console.log({ status: false })
            // })
        }
        


        









        // lend book to memeber if eligible
        // return book from member and update the member book array 
    }
}

module.exports = { lend_book_function }
