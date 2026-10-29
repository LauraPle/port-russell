const requireAuth = require('../middlewares/requireAuth');
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post('/login', async (req,res,next) => {
    try {
        const {email,password} = req.body || {};
        if(
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Veuillez saisir un email et un mot de passe.'
            });
        }
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select('+password');

        if(!user){
            return res.status(401).json({
                message: 'Email ou mot de passe incorect.'
            });
        }
        const passwordIsValid = await bcrypt.compare(
            password,
            user.password
        );
        if(!passwordIsValid) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect.'
            });
        }

        req.session.regenerate((error) => {
            if(error){
                return next(error);
            }
            req.session.userId = user._id.toString();

            req.session.save((error) => {
                if(error){
                    return next(error);
                }
                return res.status(200).json({
                    message:'Connexion réussie',
                    user:{
                        username:user.username,
                        email:user.email
                    }
                });
            });
        });
    }catch(error){
        next(error);
    }
});

router.get('/me', requireAuth, (req,res) => {
    res.status(200).json({
        username: req.user.username,
        email: req.user.email
    });
});

router.get('/logout', (req,res,next) => {
    req.session.destroy((error) => {
        if(error) {
            return next(error);
        }

        res.clearCookie('port-russell.sid', {
            path: '/'
        });

        res.redirect('/');
    });
});

module.exports = router;