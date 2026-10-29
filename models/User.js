const mongoose = require('mongoose');
const bcrypt= require('bcrypt');

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

//hachage
userSchema.pre('save', async function(){
    if(!this.isModified('password')){
        return;
    }
    if(this.password.length < 8){
        throw new Error(
            'Le mot de passe doit contenir au moins 8 caractères'
        );
    }

    if (Buffer.byteLength(this.password, 'utf8') > 72) {
        throw new Error(
            'Le mot de passe est trop long: maximum 72 octets'
        );
    }

    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model('User', userSchema);