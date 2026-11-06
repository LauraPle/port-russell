require('dotenv').config();

const express = require('express');
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
const mongoose= require('mongoose');
const session= require('express-session');
const {MongoStore} = require('connect-mongo');
const authRoutes = require('./routes/auth');
const CatwayRoutes = require('./routes/catways');
const reservationRoutes = require('./routes/reservations');
const userRoutes = require('./routes/users');
const path = require('path');
const pageRoutes = require('./routes/pages');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//configure sessions
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

app.get('/',(req,res,) => {
    res.render('home');
});

app.use('/', authRoutes);
app.use('/catways', CatwayRoutes);
app.use('/', reservationRoutes);
app.use('/users', userRoutes);
app.use('/', pageRoutes);

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
