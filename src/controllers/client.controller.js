const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// GET /api/clients
const getAll = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clients ORDER BY nom');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// GET /api/clients/:id
const getById = async (req, res) => {
    try {
        // Un client ne voit que ses propres informations
        if (req.user.role === 'client' && req.user.client_id !== req.params.id) {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Client non trouvé' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// POST /api/clients
const create = async (req, res) => {
    try {
        const { nom, email, telephone } = req.body;
        if (!nom || !email || !telephone) {
            return res.status(400).json({ error: 'Tous les champs sont requis (nom, email, telephone)' });
        }
        const id = uuidv4();
        await pool.query(
            'INSERT INTO clients (id, nom, email, telephone) VALUES (?, ?, ?, ?)',
            [id, nom, email, telephone]
        );
        const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [id]);
        res.status(201).json(rows[0]);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Cet email est déjà utilisé' });
        }
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// PUT /api/clients/:id
const update = async (req, res) => {
    try {
        const { nom, email, telephone } = req.body;
        const [existing] = await pool.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Client non trouvé' });

        await pool.query(
            'UPDATE clients SET nom = ?, email = ?, telephone = ? WHERE id = ?',
            [nom || existing[0].nom, email || existing[0].email, telephone || existing[0].telephone, req.params.id]
        );
        const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// DELETE /api/clients/:id
const remove = async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Client non trouvé' });
        await pool.query('DELETE FROM clients WHERE id = ?', [req.params.id]);
        res.json({ message: 'Client supprimé' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// GET /api/clients/:id/livraisons
const getLivraisons = async (req, res) => {
    try {
        // Un client ne voit que ses livraisons
        if (req.user.role === 'client' && req.user.client_id !== req.params.id) {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        const [client] = await pool.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
        if (client.length === 0) return res.status(404).json({ error: 'Client non trouvé' });

        const [rows] = await pool.query(
            `SELECT l.*, a.rue, a.ville, a.code_postal, t.date AS tournee_date
             FROM livraisons l
             JOIN adresses a ON l.adresse_id = a.id
             JOIN tournees t ON l.tournee_id = t.id
             WHERE l.client_id = ?
             ORDER BY l.heure_prevue DESC`,
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove, getLivraisons };
