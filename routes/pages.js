const express = require('express');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

const router = express.Router();

router.get('/dashboard', async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/');
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.redirect('/');
    }

    const now = new Date();

    const reservations = await Reservation.find({
      startDate: { $lte: now },
      endDate: { $gt: now }
    }).sort({ startDate: 1 });

    return res.render('dashboard', {
      user,
      reservations,
      today: now.toLocaleDateString('fr-FR', {
        timeZone: 'Europe/Paris'
      })
    });
  } catch (error) {
    next(error);
  }
});

router.get('/gestion/catways', async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/');
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.redirect('/');
    }

    const catways = await Catway.find().sort({ catwayNumber: 1 });

    return res.render('catways', { catways });
  } catch (error) {
    next(error);
  }
});

/**
 * Affiche la page de gestion des réservations.
 *
 * @param {import('express').Request} req - Requête reçue.
 * @param {import('express').Response} res - Réponse à envoyer.
 * @param {import('express').NextFunction} next - Fonction de continuation.
 * @returns {Promise<void|import('express').Response>}
 */
router.get('/gestion/reservations', async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/');
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.redirect('/');
    }

    const reservations = await Reservation.find()
      .sort({ startDate: 1 });

    return res.render('reservations', { reservations });
  } catch (error) {
    next(error);
  }
});
/**
 * Affiche la page de gestion des utilisateurs.
 *
 * @param {import('express').Request} req - Requête reçue.
 * @param {import('express').Response} res - Réponse à envoyer.
 * @param {import('express').NextFunction} next - Fonction de continuation.
 * @returns {Promise<void|import('express').Response>}
 */
router.get('/gestion/users', async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/');
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.redirect('/');
    }

    const users = await User.find()
      .select('username email')
      .sort({ username: 1 });

    return res.render('users', { users });
  } catch (error) {
    next(error);
  }
});
module.exports = router;