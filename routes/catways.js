const express = require('express');
const Catway = require('../models/Catway');
const requireAuth = require('../middlewares/requireAuth');

const router= express.Router();

router.use(requireAuth);

router.get('/', async (req,res, next) => {
    try{
        const catways = await Catway.find().sort({ catwayNumber: 1});

        res.status(200).json(catways);
    } catch(error){
        next(error);
    }
});

router.get('/:id', async(req,res,next) => {
    try{
        const catwayNumber = Number(req.params.id);

        if(!Number.isSafeInteger(catwayNumber) || catwayNumber < 1){
            return res.status(400).json({
                message: 'Le numéro du catway doit être un entier positif.'
            });
        }

        const catway = await Catway.findOne({ catwayNumber});

        if(!catway) {
            return res.status(404).json({
                message: 'Catway introuvable.'
            });
        }

        res.status(200).json(catway);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body || {};

    if (!Number.isSafeInteger(catwayNumber) || catwayNumber < 1) {
      return res.status(400).json({
        message: 'Le numéro du catway doit être un entier positif.'
      });
    }

    if (!['long', 'short'].includes(catwayType)) {
      return res.status(400).json({
        message: 'Le type doit être "long" ou "short".'
      });
    }

    if (
      typeof catwayState !== 'string' ||
      !catwayState.trim()
    ) {
      return res.status(400).json({
        message: 'La description de l’état est obligatoire.'
      });
    }

    const catway = await Catway.create({
      catwayNumber,
      catwayType,
      catwayState: catwayState.trim()
    });

    return res.status(201).json(catway);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Un catway possède déjà ce numéro.'
      });
    }

    next(error);
  }
});

module.exports = router;