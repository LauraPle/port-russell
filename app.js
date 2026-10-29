require('dotenv').config();

const express = require('express');
const mongoose= require('mongoose');
const session= require('express-session');
const {MongoStore} = require('connect-mongo');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//configure seessions
app.use(session({
    name:'port-russell.sid',
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({
        mongoUrl:process.env.MONGODB_URI,
        dbName:'port-russell',
        collectionName:'sessions'
    }),
    cookie:{
        httpOnly:true,
        sameSite:'lax',
        secure:process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 *2
    }
}));

app.use('/', authRoutes);

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
