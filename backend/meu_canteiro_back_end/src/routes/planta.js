import express from 'express';
import {
getPlantas,
addPlanta,
updatePlanta,
deletePlanta,
getInfoPlantas
} from '../controllers/plantasController.js';

const router = express.Router();

/**
 * @swagger
 * /plantasInfo:
 *   post:
 *     summary: Retorna informações detalhadas das plantas por lista de ids e estrato
 *     tags: [Plantas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plantas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_planta:
 *                       type: integer
 *                       example: 2
 *                     estrato:
 *                       type: string
 *                       example: "baixo"
 *     responses:
 *       200:
 *         description: Informações das plantas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plantas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       espacamento:
 *                         type: number
 *                         example: 40
 *                       estrato:
 *                         type: string
 *                         example: "baixo"
 *                       nome_planta:
 *                         type: string
 *                         example: "Abóbora"
 *                       sombra:
 *                         type: integer
 *                         example: 75
 *                       tempo_colheita:
 *                         type: integer
 *                         example: 90
 *       400:
 *         description: Dados inválidos fornecidos
 *       500:
 *         description: Erro interno ao buscar informações das plantas
 */
// Rota para obter informações das plantas por lista de ids e estrato
router.post('/plantasInfo', getInfoPlantas);

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
router.get('/plantas', getPlantas);

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
router.put('/planta', addPlanta);

/**
 * @swagger
 * /planta:
 *   post:
 *     summary: Update a plant by name
 *     tags: [Plantas]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome_planta:
 *                 type: string
 *                 description: Name of the plant to update
 *                 example: "Batata-doce"
 *               tempo_colheita:
 *                 type: integer
 *                 description: (Optional) New harvest time
 *                 example: 140
 *               estrato:
 *                 type: string
 *                 enum: [baixo, medio, alto, emergente]
 *                 description: (Optional) New stratum
 *                 example: "baixo"
 *               espacamento:
 *                 type: number
 *                 format: float
 *                 description: (Optional) New spacing
 *                 example: 0.3
 *     responses:
 *       200:
 *         description: Plant updated successfully
 *       404:
 *         description: Plant not found
 *       400:
 *         description: Invalid data provided
 */
router.post('/planta', updatePlanta);

/**
 * @swagger
 * /planta:
 *   delete:
 *     summary: Delete a plant by name
 *     summary: Delete a plant by name
 *     tags: [Plantas]
 *     parameters:
 *       - in: query
 *         name: nome_planta
 *         required: true
 *         schema:
 *           type: string
 *           example: Bananeira-prata
 *         description: Name of the plant to delete
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
 *                   example: "Batata-doce"
 *       404:
 *         description: Plant not found
 */
router.delete('/planta', deletePlanta);

export default router;