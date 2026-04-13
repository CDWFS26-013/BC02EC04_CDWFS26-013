const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
require('dotenv').config();

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { email, password, role, nom, prenom, telephone, chauffeur_id, client_id } = req.body;

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

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();
        let finalChauffeurId = chauffeur_id;
        let finalClientId = client_id;

        // Si rôle = chauffeur, créer automatiquement un chauffeur
        if (role === 'chauffeur') {
            if (!nom || !prenom || !telephone) {
                return res.status(400).json({ error: 'Nom, prénom et téléphone sont requis pour un chauffeur' });
            }
            const chauffeurId = uuidv4();
            await pool.query(
                'INSERT INTO chauffeurs (id, nom, prenom, email, telephone) VALUES (?, ?, ?, ?, ?)',
                [chauffeurId, nom, prenom, email, telephone]
            );
            finalChauffeurId = chauffeurId;
        }
        // Si rôle = client, créer automatiquement un client
        else if (role === 'client') {
            if (!nom || !telephone) {
                return res.status(400).json({ error: 'Nom et téléphone sont requis pour un client' });
            }
            const clientId = uuidv4();
            await pool.query(
                'INSERT INTO clients (id, nom, email, telephone) VALUES (?, ?, ?, ?)',
                [clientId, nom, email, telephone]
            );
            finalClientId = clientId;
        }
        // Vérifier les liens chauffeur/client existants (pour les cas manuels)
        else if (chauffeur_id) {
            const [ch] = await pool.query('SELECT id FROM chauffeurs WHERE id = ?', [chauffeur_id]);
            if (ch.length === 0) return res.status(404).json({ error: 'Chauffeur non trouvé' });
        } else if (client_id) {
            const [cl] = await pool.query('SELECT id FROM clients WHERE id = ?', [client_id]);
            if (cl.length === 0) return res.status(404).json({ error: 'Client non trouvé' });
        }

        await pool.query(
            'INSERT INTO users (id, email, password, role, chauffeur_id, client_id) VALUES (?, ?, ?, ?, ?, ?)',
            [id, email, hashedPassword, role, finalChauffeurId || null, finalClientId || null]
        );

        const token = jwt.sign(
            { id, email, role, chauffeur_id: finalChauffeurId || null, client_id: finalClientId || null },
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
