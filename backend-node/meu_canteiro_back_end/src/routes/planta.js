import express from 'express';
import {
  getPlantas,
  getPlantaById,
  addPlanta,
  updatePlanta,
  deletePlanta
} from '../controllers/plantasController.js';

const router = express.Router();

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

// List all plants
router.get('/', getPlantas);

/**
 * @swagger
 * /plantas:
 *   put:
 *     summary: Create a new plant
 *     tags: [Plantas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_planta:
 *                 type: string
 *                 example: "Batata-doce"
 *               tempo_colheita:
 *                 type: integer
 *                 example: 140
 *               estrato:
 *                 type: string
 *                 enum: [baixo, medio, alto, emergente]
 *                 example: "baixo"
 *               espacamento:
 *                 type: number
 *                 format: float
 *                 example: 0.3
 *     responses:
 *       200:
 *         description: Plant created successfully
 *       409:
 *         description: Plant with same name already exists
 *       400:
 *         description: Invalid data provided
 */

// Create new plant
router.put('/', addPlanta);

// Get plant by ID
router.get('/:id_planta', getPlantaById);

// Update plant
router.put('/:id_planta', updatePlanta);

// Delete plant
router.delete('/:id_planta', deletePlanta);

export default router;