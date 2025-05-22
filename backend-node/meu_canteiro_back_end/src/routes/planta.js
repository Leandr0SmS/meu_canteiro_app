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

// List all plants
router.get('/', getPlantas);

// Get plant by ID
router.get('/:id_planta', getPlantaById);

// Create new plant
router.post('/', addPlanta);

// Update plant
router.put('/:id_planta', updatePlanta);

// Delete plant
router.delete('/:id_planta', deletePlanta);

export default router;