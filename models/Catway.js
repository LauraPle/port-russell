const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type:Number,
        required:true,
        unique:true,
        min:1,
        validate: {
            validator: Number.isInteger,
            message: 'Le numéro du catway doit être un entier.',
        }
    },

    catwayType: {
        type:String,
        required:true,
        enum: ['long', 'short']
    },

    catwayState: {
        type: String,
        required:true,
        trim:true
    }
});

module.exports= mongoose.model('Catway', catwaySchema);