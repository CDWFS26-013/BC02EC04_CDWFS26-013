const express = require('express');
const router = express.Router();
const livraisonController = require('../controllers/livraison.controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Livraison:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         heure_prevue:
 *           type: string
 *           format: date-time
 *           example: "2026-04-13T09:00:00"
 *         statut:
 *           type: string
 *           enum: [en_attente, en_cours, livree, echouee]
 *         tournee_id:
 *           type: string
 *           format: uuid
 *         client_id:
 *           type: string
 *           format: uuid
 *         adresse_id:
 *           type: string
 *           format: uuid
 *     LivraisonCreate:
 *       type: object
 *       required: [tournee_id, client_id, adresse_id]
 *       properties:
 *         heure_prevue:
 *           type: string
 *           format: date-time
 *           example: "2026-04-13T09:00:00"
 *         statut:
 *           type: string
 *           enum: [en_attente, en_cours, livree, echouee]
 *           default: en_attente
 *         tournee_id:
 *           type: string
 *           format: uuid
 *         client_id:
 *           type: string
 *           format: uuid
 *         adresse_id:
 *           type: string
 *           format: uuid
 *         marchandises:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               marchandise_id:
 *                 type: string
 *                 format: uuid
 *               quantite:
 *                 type: integer
 *                 example: 2
 *     StatutUpdate:
 *       type: object
 *       required: [statut]
 *       properties:
 *         statut:
 *           type: string
 *           enum: [en_attente, en_cours, livree, echouee]
 *           example: livree
 */

/**
 * @swagger
 * /api/livraisons:
 *   get:
 *     tags: [Livraisons]
 *     summary: Liste de toutes les livraisons
 *     description: Filtré par rôle - un chauffeur voit celles de ses tournées, un client voit les siennes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des livraisons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Livraison'
 */
router.get('/', authenticate, livraisonController.getAll);

/**
 * @swagger
 * /api/livraisons/{id}:
 *   get:
 *     tags: [Livraisons]
 *     summary: Détails d'une livraison (avec marchandises)
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
 *         description: Détails de la livraison avec marchandises
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Livraison non trouvée
 */
router.get('/:id', authenticate, livraisonController.getById);

/**
 * @swagger
 * /api/livraisons:
 *   post:
 *     tags: [Livraisons]
 *     summary: Créer une nouvelle livraison
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LivraisonCreate'
 *     responses:
 *       201:
 *         description: Livraison créée
 *       400:
 *         description: Données manquantes
 */
router.post('/', authenticate, authorize('admin'), livraisonController.create);

/**
 * @swagger
 * /api/livraisons/{id}/statut:
 *   patch:
 *     tags: [Livraisons]
 *     summary: Mettre à jour le statut d'une livraison
 *     description: Un chauffeur peut modifier le statut des livraisons de ses tournées
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
 *             $ref: '#/components/schemas/StatutUpdate'
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       400:
 *         description: Statut invalide
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Livraison non trouvée
 */
router.patch('/:id/statut', authenticate, authorize('admin', 'chauffeur'), livraisonController.updateStatut);

/**
 * @swagger
 * /api/livraisons/{id}:
 *   put:
 *     tags: [Livraisons]
 *     summary: Modifier une livraison
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
 *             $ref: '#/components/schemas/LivraisonCreate'
 *     responses:
 *       200:
 *         description: Livraison modifiée
 *       404:
 *         description: Livraison non trouvée
 */
router.put('/:id', authenticate, authorize('admin'), livraisonController.update);

/**
 * @swagger
 * /api/livraisons/{id}:
 *   delete:
 *     tags: [Livraisons]
 *     summary: Supprimer une livraison
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
 *         description: Livraison supprimée
 *       404:
 *         description: Livraison non trouvée
 */
router.delete('/:id', authenticate, authorize('admin'), livraisonController.remove);

module.exports = router;
