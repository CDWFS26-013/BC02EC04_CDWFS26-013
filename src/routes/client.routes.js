const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nom:
 *           type: string
 *           example: Boulangerie Martin
 *         email:
 *           type: string
 *           example: contact@boulangerie-martin.fr
 *         telephone:
 *           type: string
 *           example: "0234567890"
 *     ClientCreate:
 *       type: object
 *       required: [nom, email, telephone]
 *       properties:
 *         nom:
 *           type: string
 *           example: Boulangerie Martin
 *         email:
 *           type: string
 *           example: contact@boulangerie-martin.fr
 *         telephone:
 *           type: string
 *           example: "0234567890"
 */

/**
 * @swagger
 * /api/clients:
 *   get:
 *     tags: [Clients]
 *     summary: Liste de tous les clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 */
router.get('/', authenticate, authorize('admin'), clientController.getAll);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     tags: [Clients]
 *     summary: Détails d'un client
 *     description: Un client ne voit que ses propres informations
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
 *         description: Détails du client
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Client non trouvé
 */
router.get('/:id', authenticate, authorize('admin', 'client'), clientController.getById);

/**
 * @swagger
 * /api/clients:
 *   post:
 *     tags: [Clients]
 *     summary: Créer un nouveau client
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientCreate'
 *     responses:
 *       201:
 *         description: Client créé
 *       400:
 *         description: Données manquantes
 */
router.post('/', authenticate, authorize('admin'), clientController.create);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     tags: [Clients]
 *     summary: Modifier un client
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
 *             $ref: '#/components/schemas/ClientCreate'
 *     responses:
 *       200:
 *         description: Client modifié
 *       404:
 *         description: Client non trouvé
 */
router.put('/:id', authenticate, authorize('admin'), clientController.update);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     tags: [Clients]
 *     summary: Supprimer un client
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
 *         description: Client supprimé
 *       404:
 *         description: Client non trouvé
 */
router.delete('/:id', authenticate, authorize('admin'), clientController.remove);

/**
 * @swagger
 * /api/clients/{id}/livraisons:
 *   get:
 *     tags: [Clients]
 *     summary: Consulter les livraisons d'un client
 *     description: Un client ne voit que ses propres livraisons
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
 *         description: Liste des livraisons du client
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Client non trouvé
 */
router.get('/:id/livraisons', authenticate, authorize('admin', 'client'), clientController.getLivraisons);

module.exports = router;
