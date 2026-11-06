const express = require('express');
const User = require('../models/User');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find()
      .select('username email')
      .sort({ username: 1 });

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:email', async (req, res, next) => {
  try {
    const email = req.params.email.trim().toLowerCase();

    const user = await User.findOne({ email })
      .select('username email');

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur introuvable.'
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};

    if (
      typeof username !== 'string' ||
      username.trim().length < 2 ||
      username.trim().length > 50
    ) {
      return res.status(400).json({
        message: 'Le nom doit contenir entre 2 et 50 caractères.'
      });
    }

    if (
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        message: 'Veuillez saisir une adresse email valide.'
      });
    }

    if (
      typeof password !== 'string' ||
      password.length < 8 ||
      Buffer.byteLength(password, 'utf8') > 72
    ) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 8 caractères et au maximum 72 octets.'
      });
    }

    const user = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password
    });

   
    await user.save();

    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Cette adresse email est déjà utilisée.'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Les informations de l’utilisateur sont invalides.'
      });
    }

    next(error);
  }
});

router.put('/:email', async (req, res, next) => {
  try {
    const currentEmail = req.params.email.trim().toLowerCase();
    const { username, email, password } = req.body || {};

    if (
      typeof username !== 'string' ||
      username.trim().length < 2 ||
      username.trim().length > 50
    ) {
      return res.status(400).json({
        message: 'Le nom doit contenir entre 2 et 50 caractères.'
      });
    }

    if (
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        message: 'Veuillez saisir une adresse email valide.'
      });
    }

    
    if (password !== undefined) {
      if (
        typeof password !== 'string' ||
        password.length < 8 ||
        Buffer.byteLength(password, 'utf8') > 72
      ) {
        return res.status(400).json({
          message: 'Le mot de passe doit contenir au moins 8 caractères et au maximum 72 octets.'
        });
      }
    }

    const user = await User.findOne({ email: currentEmail });

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur introuvable.'
      });
    }

    user.username = username.trim();
    user.email = email.trim().toLowerCase();

    if (password !== undefined) {
      user.password = password;
    }

  
    await user.save();

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Cette adresse email est déjà utilisée.'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Les informations de l’utilisateur sont invalides.'
      });
    }

    next(error);
  }
});

router.delete('/:email', async (req, res, next) => {
  try {
    const email = req.params.email.trim().toLowerCase();

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur introuvable.'
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;