const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: admin@legendre.fr
 *         password:
 *           type: string
 *           example: password123
 *     RegisterRequest:
 *       type: object
 *       required: [email, password, role]
 *       properties:
 *         email:
 *           type: string
 *           example: nouveau@legendre.fr
 *         password:
 *           type: string
 *           example: password123
 *         role:
 *           type: string
 *           enum: [admin, chauffeur, client]
 *         chauffeur_id:
 *           type: string
 *           description: UUID du chauffeur (si rôle chauffeur)
 *         client_id:
 *           type: string
 *           description: UUID du client (si rôle client)
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentification]
 *     summary: Créer un nouveau compte utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Données manquantes
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentification]
 *     summary: Se connecter et obtenir un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Authentification]
 *     summary: Obtenir les informations de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *       401:
 *         description: Non authentifié
 */
router.get('/me', authenticate, authController.me);

module.exports = router;
