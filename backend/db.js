const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://bt21cme086:FEBSk9oaAkvskv8H@cluster0.qf584.mongodb.net/Paytm2")
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

module.exports ={
    User
}