const express = require('express');
const router = express.Router();
const chauffeurController = require('../controllers/chauffeur.controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Chauffeur:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nom:
 *           type: string
 *           example: Dupont
 *         prenom:
 *           type: string
 *           example: Jean
 *         email:
 *           type: string
 *           example: jean.dupont@legendre.fr
 *         telephone:
 *           type: string
 *           example: "0612345678"
 *     ChauffeurCreate:
 *       type: object
 *       required: [nom, prenom, email, telephone]
 *       properties:
 *         nom:
 *           type: string
 *           example: Dupont
 *         prenom:
 *           type: string
 *           example: Jean
 *         email:
 *           type: string
 *           example: jean.dupont@legendre.fr
 *         telephone:
 *           type: string
 *           example: "0612345678"
 */

/**
 * @swagger
 * /api/chauffeurs:
 *   get:
 *     tags: [Chauffeurs]
 *     summary: Liste de tous les chauffeurs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des chauffeurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chauffeur'
 */
router.get('/', authenticate, authorize('admin'), chauffeurController.getAll);

/**
 * @swagger
 * /api/chauffeurs/{id}:
 *   get:
 *     tags: [Chauffeurs]
 *     summary: Détails d'un chauffeur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID du chauffeur
 *     responses:
 *       200:
 *         description: Détails du chauffeur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chauffeur'
 *       404:
 *         description: Chauffeur non trouvé
 */
router.get('/:id', authenticate, authorize('admin', 'chauffeur'), chauffeurController.getById);

/**
 * @swagger
 * /api/chauffeurs:
 *   post:
 *     tags: [Chauffeurs]
 *     summary: Créer un nouveau chauffeur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChauffeurCreate'
 *     responses:
 *       201:
 *         description: Chauffeur créé
 *       400:
 *         description: Données manquantes
 */
router.post('/', authenticate, authorize('admin'), chauffeurController.create);

/**
 * @swagger
 * /api/chauffeurs/{id}:
 *   put:
 *     tags: [Chauffeurs]
 *     summary: Modifier un chauffeur
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
 *             $ref: '#/components/schemas/ChauffeurCreate'
 *     responses:
 *       200:
 *         description: Chauffeur modifié
 *       404:
 *         description: Chauffeur non trouvé
 */
router.put('/:id', authenticate, authorize('admin'), chauffeurController.update);

/**
 * @swagger
 * /api/chauffeurs/{id}:
 *   delete:
 *     tags: [Chauffeurs]
 *     summary: Supprimer un chauffeur
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
 *         description: Chauffeur supprimé
 *       404:
 *         description: Chauffeur non trouvé
 */
router.delete('/:id', authenticate, authorize('admin'), chauffeurController.remove);

/**
 * @swagger
 * /api/chauffeurs/{id}/tournees:
 *   get:
 *     tags: [Chauffeurs]
 *     summary: Consulter les tournées d'un chauffeur
 *     description: Un chauffeur ne voit que ses propres tournées
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
 *         description: Liste des tournées du chauffeur
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Chauffeur non trouvé
 */
router.get('/:id/tournees', authenticate, authorize('admin', 'chauffeur'), chauffeurController.getTournees);

module.exports = router;
