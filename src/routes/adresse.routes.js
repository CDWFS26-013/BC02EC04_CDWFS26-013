const express = require('express');
const router = express.Router();
const adresseController = require('../controllers/adresse.controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Adresse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         rue:
 *           type: string
 *           example: 12 rue de la Paix
 *         ville:
 *           type: string
 *           example: Chartres
 *         code_postal:
 *           type: string
 *           example: "28000"
 *         pays:
 *           type: string
 *           example: France
 *     AdresseCreate:
 *       type: object
 *       required: [rue, ville, code_postal]
 *       properties:
 *         rue:
 *           type: string
 *           example: 12 rue de la Paix
 *         ville:
 *           type: string
 *           example: Chartres
 *         code_postal:
 *           type: string
 *           example: "28000"
 *         pays:
 *           type: string
 *           example: France
 *           default: France
 */

/**
 * @swagger
 * /api/adresses:
 *   get:
 *     tags: [Adresses]
 *     summary: Liste de toutes les adresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des adresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Adresse'
 */
router.get('/', authenticate, adresseController.getAll);

/**
 * @swagger
 * /api/adresses/{id}:
 *   get:
 *     tags: [Adresses]
 *     summary: Détails d'une adresse
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
 *         description: Détails de l'adresse
 *       404:
 *         description: Adresse non trouvée
 */
router.get('/:id', authenticate, adresseController.getById);

/**
 * @swagger
 * /api/adresses:
 *   post:
 *     tags: [Adresses]
 *     summary: Créer une nouvelle adresse
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdresseCreate'
 *     responses:
 *       201:
 *         description: Adresse créée
 *       400:
 *         description: Données manquantes
 */
router.post('/', authenticate, authorize('admin'), adresseController.create);

/**
 * @swagger
 * /api/adresses/{id}:
 *   put:
 *     tags: [Adresses]
 *     summary: Modifier une adresse
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
 *             $ref: '#/components/schemas/AdresseCreate'
 *     responses:
 *       200:
 *         description: Adresse modifiée
 *       404:
 *         description: Adresse non trouvée
 */
router.put('/:id', authenticate, authorize('admin'), adresseController.update);

/**
 * @swagger
 * /api/adresses/{id}:
 *   delete:
 *     tags: [Adresses]
 *     summary: Supprimer une adresse
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
 *         description: Adresse supprimée
 *       404:
 *         description: Adresse non trouvée
 */
router.delete('/:id', authenticate, authorize('admin'), adresseController.remove);

module.exports = router;
