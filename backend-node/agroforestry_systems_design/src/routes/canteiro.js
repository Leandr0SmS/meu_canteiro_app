import express from 'express';
import {
  createCanteiro,
  getCanteiro,
  updateCanteiro,
  deleteCanteiro
} from '../controllers/canteiroController.js';

const router = express.Router();

/**
 * @swagger
 * /canteiro:
 *   put:
 *     summary: Create a new canteiro
 *     tags: [Canteiro]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_canteiro:
 *                 type: string
 *                 example: "Canteiro 1"
 *               x_canteiro:
 *                 type: integer
 *                 example: 200
 *               y_canteiro:
 *                 type: integer
 *                 example: 100
 *               plantas_canteiro:
 *                 type: object
 *                 example: { "alto": [], "baixo": [], "medio": [], "emergente": [] }
 *     responses:
 *       201:
 *         description: Canteiro created successfully
 *       400:
 *         description: Invalid data provided
 */
router.put('/canteiro', createCanteiro);

/**
 * @swagger
 * /canteiro:
 *   get:
 *     summary: Get a canteiro by name
 *     tags: [Canteiro]
 *     parameters:
 *       - in: query
 *         name: nome_canteiro
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the canteiro to retrieve
 *     responses:
 *       200:
 *         description: Canteiro found
 *       404:
 *         description: Canteiro not found
 */
router.get('/canteiro', getCanteiro);

/**
 * @swagger
 * /canteiro:
 *   post:
 *     summary: Update a canteiro by name
 *     tags: [Canteiro]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_canteiro:
 *                 type: string
 *                 example: "Canteiro 1"
 *               x_canteiro:
 *                 type: integer
 *                 example: 250
 *               y_canteiro:
 *                 type: integer
 *                 example: 120
 *               plantas_canteiro:
 *                 type: object
 *                 example: { "alto": [], "baixo": [], "medio": [], "emergente": [] }
 *     responses:
 *       200:
 *         description: Canteiro updated successfully
 *       404:
 *         description: Canteiro not found
 *       400:
 *         description: Invalid data provided
 */
router.post('/canteiro', updateCanteiro);

/**
 * @swagger
 * /canteiro:
 *   delete:
 *     summary: Delete a canteiro by name
 *     tags: [Canteiro]
 *     parameters:
 *       - in: query
 *         name: nome_canteiro
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the canteiro to delete
 *     responses:
 *       200:
 *         description: Canteiro deleted successfully
 *       404:
 *         description: Canteiro not found
 */
router.delete('/canteiro', deleteCanteiro);

export default router;