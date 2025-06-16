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
 * /planta:
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

/**
 * @swagger
 * /plantas/{id_planta}:
 *   get:
 *     summary: Get a plant by ID
 *     tags: [Plantas]
 *     parameters:
 *       - in: path
 *         name: id_planta
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plant ID
 *     responses:
 *       200:
 *         description: Plant found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_planta:
 *                   type: integer
 *                 nome_planta:
 *                   type: string
 *                 tempo_colheita:
 *                   type: integer
 *                 estrato:
 *                   type: string
 *                 espacamento:
 *                   type: number
 *       404:
 *         description: Plant not found
 */
router.get('/:id_planta', getPlantaById);

/**
 * @swagger
 * /plantas/{id_planta}:
 *   post:
 *     summary: Update a plant by ID
 *     tags: [Plantas]
 *     parameters:
 *       - in: path
 *         name: id_planta
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tempo_colheita:
 *                 type: integer
 *                 required: false
 *                 example: 140
 *               estrato:
 *                 type: string
 *                 enum: [baixo, medio, alto, emergente]
 *                 required: false
 *                 example: "baixo"
 *               espacamento:
 *                 type: number
 *                 format: float
 *                 required: false
 *                 example: 0.3
 *     responses:
 *       200:
 *         description: Plant updated successfully
 *       404:
 *         description: Plant not found
 *       400:
 *         description: Invalid data provided
 */
router.post('/:id_planta', updatePlanta);

/**
 * @swagger
 * /plantas/{id_planta}:
 *   delete:
 *     summary: Delete a plant by ID
 *     tags: [Plantas]
 *     parameters:
 *       - in: path
 *         name: id_planta
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plant ID
 *     responses:
 *       200:
 *         description: Plant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Planta removida"
 *                 nome_planta:
 *                   type: string
 *       404:
 *         description: Plant not found
 */
router.delete('/:id_planta', deletePlanta);

export default router;