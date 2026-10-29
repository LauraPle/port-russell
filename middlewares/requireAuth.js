const User = require('../models/User');

async function requireAuth(req, res, next){
    try{
        if(!req.session.userId){
            return res.status(401).json({
                message: 'Vous devez etre connecté.'
            });
        }
        const user = await User.findById(req.session.userId);

        if(!user){
            return res.status(401).json({
                message: 'Utilisateur introuvable.Veuillez vous reconnecter.'
            });
        }
        req.user = user;
        next();
    }catch(error){
        next(error);
    }
}

module.exports = requireAuth;