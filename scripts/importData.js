require('dotenv').config();

const mongoose= require('mongoose');

const Catway = require('../models/catway');
const Reservation = require('../models/reservation');

const catways = require('../data/catways.json');
const reservations = require('../data/reservations.json');

async function importData() {
    try{
        if(!process.env.MONGODB_URI){
            throw new Error('MONGODB_URI est absent du fichier .env');
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName:'port-russell'
        });
        console.log('Connexion à MongoDB réussie');

        // verifier collections vides avant importation
        const catwayCount = await Catway.countDocuments();
        const reservationCount = await Reservation.countDocuments();

        if(catwayCount > 0 || reservationCount > 0) {
            console.log('Import annulé: des données existent déjà dans les collections.');
            return;
        }

        await Catway.init();

        const importedCatways = await Catway.insertMany(catways);
        console.log(`${importedCatways.length} catways importés`);

        const importedReservations = await Reservation.insertMany(reservations);
        console.log(`${importedReservations.length} réservations importées`);
    } catch(error){
        console.error('Erreur pendant l`importation :', error.message);
        process.exitCode = 1;
    }finally{
        await mongoose.disconnect();
        console.log('Connexion à MongoDB fermée');
    }
}

importData();