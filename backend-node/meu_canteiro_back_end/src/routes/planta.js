import express from 'express';
import {
  getPlantas,
  getPlantaById,
  addPlanta,
  updatePlanta,
  deletePlanta
} from '../controllers/plantasController.js';

const router = express.Router();


router.get('/plantas', getPlantas);

router.get('/', getPlantaById);
router.post('/', addPlanta);
router.put('/:id', updatePlanta);
router.delete('/:id', deletePlanta);

export default router;