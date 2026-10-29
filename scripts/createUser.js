require('dotenv').config();

const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
const User= require('../models/User');

async function createUser(){
    try{
        const {
            MONGODB_URI,
            INITIAL_USER_NAME,
            INITIAL_USER_EMAIL,
            INITIAL_USER_PASSWORD
        }= process.env;
        if(
            !MONGODB_URI ||
            !INITIAL_USER_NAME ||
            !INITIAL_USER_EMAIL ||
            !INITIAL_USER_PASSWORD
        ) {
            throw new Error(
                'Des informations sont manquantes dans le fichier .env'
            );
        }
        await mongoose.connect(MONGODB_URI, {
            dbName: 'port-russell'
        });
        console.log('Connexion à MongoDB réussie');

        await User.init();

        const email= INITIAL_USER_EMAIL.trim().toLowerCase();
        
        const existingUser= await User.findOne({ email });

        if(existingUser) {
            console.log('Un utilisateur possède déjà cette adresse mail');
            return;
        }

        const user = new User({
            username:INITIAL_USER_NAME,
            email,
            password:INITIAL_USER_PASSWORD
        });
        await user.save();

        console.log('Utiliateur créé');

        const savedUser = await User.findById(user._id).select('+password');

        const passwordIsValid = await bcrypt.compare(
            INITIAL_USER_PASSWORD,
            savedUser.password
        );

        if(
            savedUser.password === INITIAL_USER_PASSWORD ||
            !passwordIsValid
        ){
            throw new Error('La vérification du hachage a échoué');
        }

        console.log('hachage du mot de passe vérifié');
    } catch (error){
        console.error('Erreur:', error.message);
        process.exitCode = 1;
    } finally{
        await mongoose.disconnect();
    }
}

createUser();