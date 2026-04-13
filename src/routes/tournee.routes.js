const express = require('express');
const router = express.Router();
const tourneeController = require('../controllers/tournee.controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Tournee:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-04-13"
 *         chauffeur_id:
 *           type: string
 *           format: uuid
 *         chauffeur_nom:
 *           type: string
 *         chauffeur_prenom:
 *           type: string
 *     TourneeCreate:
 *       type: object
 *       required: [date, chauffeur_id]
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-04-13"
 *         chauffeur_id:
 *           type: string
 *           format: uuid
 */

/**
 * @swagger
 * /api/tournees:
 *   get:
 *     tags: [Tournées]
 *     summary: Liste de toutes les tournées
 *     description: Un chauffeur ne voit que ses propres tournées
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des tournées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tournee'
 */
router.get('/', authenticate, authorize('admin', 'chauffeur'), tourneeController.getAll);

/**
 * @swagger
 * /api/tournees/{id}:
 *   get:
 *     tags: [Tournées]
 *     summary: Détails d'une tournée
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
 *         description: Détails de la tournée
 *       404:
 *         description: Tournée non trouvée
 */
router.get('/:id', authenticate, authorize('admin', 'chauffeur'), tourneeController.getById);

/**
 * @swagger
 * /api/tournees:
 *   post:
 *     tags: [Tournées]
 *     summary: Créer une nouvelle tournée
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourneeCreate'
 *     responses:
 *       201:
 *         description: Tournée créée
 *       400:
 *         description: Données manquantes
 */
router.post('/', authenticate, authorize('admin'), tourneeController.create);

/**
 * @swagger
 * /api/tournees/{id}:
 *   put:
 *     tags: [Tournées]
 *     summary: Modifier une tournée
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
 *             $ref: '#/components/schemas/TourneeCreate'
 *     responses:
 *       200:
 *         description: Tournée modifiée
 *       404:
 *         description: Tournée non trouvée
 */
router.put('/:id', authenticate, authorize('admin'), tourneeController.update);

/**
 * @swagger
 * /api/tournees/{id}:
 *   delete:
 *     tags: [Tournées]
 *     summary: Supprimer une tournée
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
 *         description: Tournée supprimée
 *       404:
 *         description: Tournée non trouvée
 */
router.delete('/:id', authenticate, authorize('admin'), tourneeController.remove);

/**
 * @swagger
 * /api/tournees/{id}/livraisons:
 *   get:
 *     tags: [Tournées]
 *     summary: Consulter les livraisons d'une tournée
 *     description: Un chauffeur ne voit que les livraisons de ses propres tournées
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
 *         description: Liste des livraisons de la tournée
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Tournée non trouvée
 */
router.get('/:id/livraisons', authenticate, authorize('admin', 'chauffeur'), tourneeController.getLivraisons);

module.exports = router;
