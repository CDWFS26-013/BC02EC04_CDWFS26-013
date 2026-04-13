const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// GET /api/marchandises
const getAll = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM marchandises ORDER BY nom');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// GET /api/marchandises/:id
const getById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM marchandises WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Marchandise non trouvée' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// POST /api/marchandises
const create = async (req, res) => {
    try {
        const { nom, poids, volume } = req.body;
        if (!nom || poids === undefined || volume === undefined) {
            return res.status(400).json({ error: 'Tous les champs sont requis (nom, poids, volume)' });
        }
        const id = uuidv4();
        await pool.query(
            'INSERT INTO marchandises (id, nom, poids, volume) VALUES (?, ?, ?, ?)',
            [id, nom, poids, volume]
        );
        const [rows] = await pool.query('SELECT * FROM marchandises WHERE id = ?', [id]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// PUT /api/marchandises/:id
const update = async (req, res) => {
    try {
        const { nom, poids, volume } = req.body;
        const [existing] = await pool.query('SELECT * FROM marchandises WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Marchandise non trouvée' });

        await pool.query(
            'UPDATE marchandises SET nom = ?, poids = ?, volume = ? WHERE id = ?',
            [nom || existing[0].nom, poids !== undefined ? poids : existing[0].poids, volume !== undefined ? volume : existing[0].volume, req.params.id]
        );
        const [rows] = await pool.query('SELECT * FROM marchandises WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// DELETE /api/marchandises/:id
const remove = async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT * FROM marchandises WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Marchandise non trouvée' });
        await pool.query('DELETE FROM marchandises WHERE id = ?', [req.params.id]);
        res.json({ message: 'Marchandise supprimée' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove };
