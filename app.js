const express = require('express');

const app = express();
const PORT = 3000;

//permet de lire données JSON envoyées à l'API
app.use(express.json());

//premiere route pour vérifier que le serveur fonctionne
app.get('/',(req,res,) => {
    res.send('Bienvenue au port de Plaisance de Russell');
});

//démarre le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
