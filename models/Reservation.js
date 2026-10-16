const mongoose= require('mongoose');

const reservationSchema = new mongoose.Schema({
    catwayNumber: {
        type: Number,
        required:true,
        min:1,
        validate: {
            validator: Number.isInteger,
            message: 'Le numéro du catway doit être un entier.'
        }
    },

    clientName: {
        type:String,
        required:true,
        trim:true
    },

    boatName: {
        type: String,
        required:true,
        trim:true
    },

    startDate: {
        type: Date,
        required:true
    },

    endDate: {
        type:Date,
        required:true
    }

});

module.exports= mongoose.model('Reservation', reservationSchema);