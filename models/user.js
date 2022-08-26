//for login and logout using passpot.js i am creating user model 

const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose'); //importing passport 

const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

UserSchema.plugin(passportLocalMongoose); //it will add username,password to schema and additional methods

module.exports=mongoose.model('User',UserSchema);

