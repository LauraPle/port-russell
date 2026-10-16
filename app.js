require('dotenv').config();

const express = require('express');
const mongoose= require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

//permet de lire données JSON envoyées à l'API
app.use(express.json());

//premiere route pour vérifier que le serveur fonctionne
app.get('/',(req,res,) => {
    res.send('Bienvenue au port de Plaisance de Russell');
});

async function startServer(){
    try{
        if(!process.env.MONGODB_URI){
            throw new Error('MONGODB_URI est absent du fichier.env');
        }
        await mongoose.connect(process.env.MONGODB_URI,{
            dbName: 'port-russell'
        });
        console.log('Connexion à mongoDB réussie');

        //démarre le serveur
        app.listen(PORT, () => {
            console.log(`Serveur démarré sut http://localhost:${PORT}`);
        });
    }catch(error){
        console.error(`Erreur au démarrage:`, error.message);
        process.exit(1);
    }
}

startServer();
