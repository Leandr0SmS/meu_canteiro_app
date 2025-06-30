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
 *                 example: "Canteiro_test"
 *               x_canteiro:
 *                 type: integer
 *                 example: 200
 *               y_canteiro:
 *                 type: integer
 *                 example: 100
 *               plantas_canteiro:
 *                 type: object
 *                 example:
 *                   plantas:
 *                     - espacamento: 200
 *                       estrato: "emergente"
 *                       nome_planta: "Coco"
 *                       sombra: 30
 *                       tempo_colheita: 1095
 *                     - espacamento: 60
 *                       estrato: "alto"
 *                       nome_planta: "Amora (Fruta)"
 *                       sombra: 50
 *                       tempo_colheita: 1800
 *                     - espacamento: 50
 *                       estrato: "medio"
 *                       nome_planta: "Almeirão / Radiche"
 *                       sombra: 65
 *                       tempo_colheita: 70
 *                     - espacamento: 40
 *                       estrato: "baixo"
 *                       nome_planta: "Abóbora"
 *                       sombra: 75
 *                       tempo_colheita: 90
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
 * /canteiros:
 *   get:
 *     summary: Get all canteiros
 *     tags: [Canteiro]
 *     responses:
 *       200:
 *         description: List of all canteiros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_canteiro:
 *                     type: integer
 *                   nome_canteiro:
 *                     type: string
 *                   x_canteiro:
 *                     type: integer
 *                   y_canteiro:
 *                     type: integer
 *                   plantas_canteiro:
 *                     type: object
 *       404:
 *         description: No canteiros found
 */
router.get('/canteiros', async (req, res) => {
  try {
    const canteiros = await import('../models/canteiro.js').then(m => m.default.findAll());
    if (!canteiros || canteiros.length === 0) {
      return res.status(404).json({ message: 'No canteiros found' });
    }
    res.status(200).json(canteiros);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching canteiros', error: error.message });
  }
});

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