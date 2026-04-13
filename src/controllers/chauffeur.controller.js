const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// GET /api/chauffeurs
const getAll = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM chauffeurs ORDER BY nom');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// GET /api/chauffeurs/:id
const getById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM chauffeurs WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Chauffeur non trouvé' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// POST /api/chauffeurs
const create = async (req, res) => {
    try {
        const { nom, prenom, email, telephone } = req.body;
        if (!nom || !prenom || !email || !telephone) {
            return res.status(400).json({ error: 'Tous les champs sont requis (nom, prenom, email, telephone)' });
        }
        const id = uuidv4();
        await pool.query(
            'INSERT INTO chauffeurs (id, nom, prenom, email, telephone) VALUES (?, ?, ?, ?, ?)',
            [id, nom, prenom, email, telephone]
        );
        const [rows] = await pool.query('SELECT * FROM chauffeurs WHERE id = ?', [id]);
        res.status(201).json(rows[0]);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Cet email est déjà utilisé' });
        }
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// PUT /api/chauffeurs/:id
const update = async (req, res) => {
    try {
        const { nom, prenom, email, telephone } = req.body;
        const [existing] = await pool.query('SELECT * FROM chauffeurs WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Chauffeur non trouvé' });

        await pool.query(
            'UPDATE chauffeurs SET nom = ?, prenom = ?, email = ?, telephone = ? WHERE id = ?',
            [nom || existing[0].nom, prenom || existing[0].prenom, email || existing[0].email, telephone || existing[0].telephone, req.params.id]
        );
        const [rows] = await pool.query('SELECT * FROM chauffeurs WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// DELETE /api/chauffeurs/:id
const remove = async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT * FROM chauffeurs WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Chauffeur non trouvé' });
        await pool.query('DELETE FROM chauffeurs WHERE id = ?', [req.params.id]);
        res.json({ message: 'Chauffeur supprimé' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// GET /api/chauffeurs/:id/tournees
const getTournees = async (req, res) => {
    try {
        // Vérifier les droits : un chauffeur ne voit que ses tournées
        if (req.user.role === 'chauffeur' && req.user.chauffeur_id !== req.params.id) {
            return res.status(403).json({ error: 'Accès interdit : vous ne pouvez voir que vos propres tournées' });
        }

        const [chauffeur] = await pool.query('SELECT * FROM chauffeurs WHERE id = ?', [req.params.id]);
        if (chauffeur.length === 0) return res.status(404).json({ error: 'Chauffeur non trouvé' });

        const [rows] = await pool.query(
            'SELECT * FROM tournees WHERE chauffeur_id = ? ORDER BY date DESC',
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove, getTournees };
