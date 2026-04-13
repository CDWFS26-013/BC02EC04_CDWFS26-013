const express = require('express');
const router = express.Router();
const marchandiseController = require('../controllers/marchandise.controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Marchandise:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nom:
 *           type: string
 *           example: Palette de farine
 *         poids:
 *           type: number
 *           example: 500.0
 *         volume:
 *           type: number
 *           example: 1.2
 *     MarchandiseCreate:
 *       type: object
 *       required: [nom, poids, volume]
 *       properties:
 *         nom:
 *           type: string
 *           example: Palette de farine
 *         poids:
 *           type: number
 *           example: 500.0
 *         volume:
 *           type: number
 *           example: 1.2
 */

/**
 * @swagger
 * /api/marchandises:
 *   get:
 *     tags: [Marchandises]
 *     summary: Liste de toutes les marchandises
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des marchandises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Marchandise'
 */
router.get('/', authenticate, marchandiseController.getAll);

/**
 * @swagger
 * /api/marchandises/{id}:
 *   get:
 *     tags: [Marchandises]
 *     summary: Détails d'une marchandise
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la marchandise
 *       404:
 *         description: Marchandise non trouvée
 */
router.get('/:id', authenticate, marchandiseController.getById);

/**
 * @swagger
 * /api/marchandises:
 *   post:
 *     tags: [Marchandises]
 *     summary: Créer une nouvelle marchandise
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarchandiseCreate'
 *     responses:
 *       201:
 *         description: Marchandise créée
 *       400:
 *         description: Données manquantes
 */
router.post('/', authenticate, authorize('admin'), marchandiseController.create);

/**
 * @swagger
 * /api/marchandises/{id}:
 *   put:
 *     tags: [Marchandises]
 *     summary: Modifier une marchandise
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarchandiseCreate'
 *     responses:
 *       200:
 *         description: Marchandise modifiée
 *       404:
 *         description: Marchandise non trouvée
 */
router.put('/:id', authenticate, authorize('admin'), marchandiseController.update);

/**
 * @swagger
 * /api/marchandises/{id}:
 *   delete:
 *     tags: [Marchandises]
 *     summary: Supprimer une marchandise
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Marchandise supprimée
 *       404:
 *         description: Marchandise non trouvée
 */
router.delete('/:id', authenticate, authorize('admin'), marchandiseController.remove);

module.exports = router;
