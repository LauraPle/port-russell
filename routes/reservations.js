const express = require('express');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();
router.use(requireAuth);

router.get('/catways/:id/reservations', async (req,res,next) => {
    try{
        const catwayNumber = Number(req.params.id);

        if(!Number.isSafeInteger(catwayNumber) || catwayNumber < 1){
            return res.status(400).json({
                message: 'Le numero du catway doit etre un entier positif'
            });
        } 

        const catway = await Catway.findOne({ catwayNumber});

        if(!catway){
            return res.status(404).json({
                message: 'Catway introuvable'
            });
        }

        const reservations = await Reservation.find({
            catwayNumber
        }).sort({ startDate: 1 });

        return res.status(200).json(reservations);
    } catch(error){
        next(error);
    }
});

router.get('/catway/:id/reservations/:idReservation', async (req,res, next) => {
    try{
        const catwayNumber = Number(req.params.id);
        const idReservation = req.params.idReservation;

        if(!Number.isSafeInteger(catwayNumber) || catwayNumber < 1){
            return res.status(400).json({
                message: 'le numero du catway doit etre un entier positif'
            });
        }

        if (!/^[0-9a-fA-F]{24}$/.test(idReservation)) {
      return res.status(400).json({
        message: 'Identifiant de réservation invalide.'
      });
    }

    const catway = await Catway.findOne({ catwayNumber });

    if(!catway) {
        return res.status(404).json({
            message: 'catway introuvable'
        });
    }

    const reservation = await Reservation.findOne({
        _id: idReservation,
        catwayNumber
    });

    if(!reservation){
        return res.status(404).json({
            message: 'reservation introuvable pour ce catway'
        });
    }

    return res.status(200).json(reservation);
} catch (error) {
    next(error);
}

});

router.post('/catways/:id/reservations', async (req,res,next) => {
    try{
        const catwayNumber = Number(req.params.id);

        if(!Number.isSafeInteger(catwayNumber) || catwayNumber < 1) {
            return res.status(400).json({
                message: 'le numero du catway doit etre un entier positif'
            });
        }

        const {clientName, boatName, startDate, endDate } = req.body || {};

        if(
            typeof clientName !== 'string' || !clientName.trim() ||
            typeof boatName !== 'string' || !boatName.trim()
        ) {
            return res.status(400).json({
                message: 'le nom du client et le nom du bateau sont obligatoires'
            });
        }

        if(
            typeof startDate !== 'string' || !startDate.trim() ||
            typeof endDate !== 'string' || !endDate.trim()
        ) {
            return res.status(400).json({
                message: ' les dates de début et de fin sont obligatoires'
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if(
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            end <= start
        ) {
            return res.status(400).json({
                message: 'les dates doivent etre valides et la fin posterieure au debut'
            });
        }

        const catway = await Catway.findOne({ catwayNumber});

        if (!catway) {
            return res.status(404).json({
                message: 'catway introuvable'
            });
        }

        const overlap = await Reservation.findOne({
            catwayNumber,
            startDate: { $lt: end},
            endDate: { $gt: start}
        });

        if(overlap) {
            return res.status(409).json({
                message: 'ce catway est déjà réservé sur cette periode'
            });
        }

        const reservation = await Reservation.create({
            catwayNumber,
            clientName: clientName.trim(),
            boatName: boatName.trim(),
            startDate: start,
            endDate:end

        });

        return res.status(201).json(reservation);
    } catch(error){
        next(error);
    }
});

router.put('/catways/:id/reservations', async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);

    if (!Number.isSafeInteger(catwayNumber) || catwayNumber < 1) {
      return res.status(400).json({
        message: 'Le numéro du catway doit être un entier positif.'
      });
    }

    const {
      idReservation,
      clientName,
      boatName,
      startDate,
      endDate
    } = req.body || {};

    if (
      typeof idReservation !== 'string' ||
      !/^[0-9a-fA-F]{24}$/.test(idReservation)
    ) {
      return res.status(400).json({
        message: 'Identifiant de réservation invalide.'
      });
    }

    if (
      typeof clientName !== 'string' || !clientName.trim() ||
      typeof boatName !== 'string' || !boatName.trim()
    ) {
      return res.status(400).json({
        message: 'Le nom du client et le nom du bateau sont obligatoires.'
      });
    }

    if (
      typeof startDate !== 'string' || !startDate.trim() ||
      typeof endDate !== 'string' || !endDate.trim()
    ) {
      return res.status(400).json({
        message: 'Les dates de début et de fin sont obligatoires.'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return res.status(400).json({
        message: 'Les dates doivent être valides et la fin postérieure au début.'
      });
    }

    const catway = await Catway.findOne({ catwayNumber });

    if (!catway) {
      return res.status(404).json({
        message: 'Catway introuvable.'
      });
    }

    const reservation = await Reservation.findOne({
      _id: idReservation,
      catwayNumber
    });

    if (!reservation) {
      return res.status(404).json({
        message: 'Réservation introuvable pour ce catway.'
      });
    }

    const overlap = await Reservation.findOne({
      catwayNumber,
      _id: { $ne: idReservation },
      startDate: { $lt: end },
      endDate: { $gt: start }
    });

    if (overlap) {
      return res.status(409).json({
        message: 'Ce catway est déjà réservé sur cette période.'
      });
    }

    reservation.clientName = clientName.trim();
    reservation.boatName = boatName.trim();
    reservation.startDate = start;
    reservation.endDate = end;

    await reservation.save();

    return res.status(200).json(reservation);
  } catch (error) {
    next(error);
  }
});

router.delete('/catway/:id/reservations/:idReservation', async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);
    const idReservation = req.params.idReservation;

    if (!Number.isSafeInteger(catwayNumber) || catwayNumber < 1) {
      return res.status(400).json({
        message: 'Le numéro du catway doit être un entier positif.'
      });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(idReservation)) {
      return res.status(400).json({
        message: 'Identifiant de réservation invalide.'
      });
    }

    const reservation = await Reservation.findOneAndDelete({
      _id: idReservation,
      catwayNumber
    });

    if (!reservation) {
      return res.status(404).json({
        message: 'Réservation introuvable pour ce catway.'
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;