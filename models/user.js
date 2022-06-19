const mongoose = require('mongoose');
const passportLocalmongoose = require('passport-local-mongoose');
const schema = mongoose.Schema;

const userSchema = new schema ({
    email:{
        type:String,
        required:true,
        unique:true
    }
});
userSchema.plugin(passportLocalmongoose);

module.exports = mongoose.model('User',userSchema);