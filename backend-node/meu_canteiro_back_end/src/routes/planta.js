import express from 'express';
import {
  getPlantas,
  getPlantaById,
  addPlanta,
  updatePlanta,
  deletePlanta
} from '../controllers/plantasController.js';

/**
 * @swagger
 * /plantas:
 *   get:
 *     summary: Lista todas as plantas
 *     tags: [Plantas]
 *     responses:
 *       200:
 *         description: Lista de plantas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 */

const router = express.Router();


router.get('/plantas', getPlantas);

router.get('/', getPlantaById);
router.post('/', addPlanta);
router.put('/:id', updatePlanta);
router.delete('/:id', deletePlanta);

export default router;