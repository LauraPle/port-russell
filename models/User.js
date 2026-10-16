const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:50
    },

    email: {
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        match:[
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Veuillez saisir une adresse email valide.'
        ]
    },

    password: {
        type: String,
        required:true,
        select:false,
    }
});

module.exports = mongoose.model('User', userSchema);