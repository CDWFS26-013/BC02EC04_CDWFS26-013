const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
require('dotenv').config();

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { email, password, role, chauffeur_id, client_id } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, mot de passe et rôle sont requis' });
        }

        if (!['admin', 'chauffeur', 'client'].includes(role)) {
            return res.status(400).json({ error: 'Rôle invalide (admin, chauffeur, client)' });
        }

        // Vérifier si l'email existe déjà
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Cet email est déjà utilisé' });
        }

        // Vérifier les liens chauffeur/client
        if (role === 'chauffeur' && chauffeur_id) {
            const [ch] = await pool.query('SELECT id FROM chauffeurs WHERE id = ?', [chauffeur_id]);
            if (ch.length === 0) return res.status(404).json({ error: 'Chauffeur non trouvé' });
        }
        if (role === 'client' && client_id) {
            const [cl] = await pool.query('SELECT id FROM clients WHERE id = ?', [client_id]);
            if (cl.length === 0) return res.status(404).json({ error: 'Client non trouvé' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        await pool.query(
            'INSERT INTO users (id, email, password, role, chauffeur_id, client_id) VALUES (?, ?, ?, ?, ?, ?)',
            [id, email, hashedPassword, role, chauffeur_id || null, client_id || null]
        );

        const token = jwt.sign(
            { id, email, role, chauffeur_id: chauffeur_id || null, client_id: client_id || null },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({ message: 'Utilisateur créé', token, user: { id, email, role } });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, chauffeur_id: user.chauffeur_id, client_id: user.client_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ message: 'Connexion réussie', token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// GET /api/auth/me
const me = async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, email, role, chauffeur_id, client_id, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        if (users.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(users[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

module.exports = { register, login, me };
