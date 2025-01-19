const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://bt21cme086:FEBSk9oaAkvskv8H@cluster0.qf584.mongodb.net/Paytm")
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        minLength: 3,
        maxLength: 30
    },
    firstName: {
        type:String,
        required: true,
        trim: true,
        maxLength:50
    },
    lastName : {
        type : String,
        required : true,
        trim: true,
        maxLength: 50,
    },
    password : {
        type : String,
        required : true,
        minLength : 6
    }
})
const User = mongoose.model("User",userSchema);
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance : {
        type : Number,
        required: true
    }
})

const Account = mongoose.model('Account',accountSchema)

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true
      }
});


const Transactions = new mongoose.model('Transactions',transactionSchema);
module.exports ={
    User,
    Account,
    Transactions
}