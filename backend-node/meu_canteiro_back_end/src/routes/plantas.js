import express from 'express';
import {
  getPlantas,
  addPlanta,
  updatePlanta,
  deletePlanta
} from '../controllers/plantasController.js';

const router = express.Router();

router.get('/', getPlantas);
router.post('/', addPlanta);
router.put('/:id', updatePlanta);
router.delete('/:id', deletePlanta);

export default router;