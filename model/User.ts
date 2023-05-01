import mongoose from "mongoose";
const Schema = mongoose.Schema ;

const userSchema = new Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true
    },
    refreshToken : String,
});


module.exports = mongoose.model('User' , userSchema);