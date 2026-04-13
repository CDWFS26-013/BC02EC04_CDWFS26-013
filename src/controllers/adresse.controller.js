const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// GET /api/adresses
const getAll = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM adresses ORDER BY ville, rue');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// GET /api/adresses/:id
const getById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM adresses WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Adresse non trouvée' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// POST /api/adresses
const create = async (req, res) => {
    try {
        const { rue, ville, code_postal, pays } = req.body;
        if (!rue || !ville || !code_postal) {
            return res.status(400).json({ error: 'rue, ville et code_postal sont requis' });
        }
        const id = uuidv4();
        await pool.query(
            'INSERT INTO adresses (id, rue, ville, code_postal, pays) VALUES (?, ?, ?, ?, ?)',
            [id, rue, ville, code_postal, pays || 'France']
        );
        const [rows] = await pool.query('SELECT * FROM adresses WHERE id = ?', [id]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// PUT /api/adresses/:id
const update = async (req, res) => {
    try {
        const { rue, ville, code_postal, pays } = req.body;
        const [existing] = await pool.query('SELECT * FROM adresses WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Adresse non trouvée' });

        await pool.query(
            'UPDATE adresses SET rue = ?, ville = ?, code_postal = ?, pays = ? WHERE id = ?',
            [rue || existing[0].rue, ville || existing[0].ville, code_postal || existing[0].code_postal, pays || existing[0].pays, req.params.id]
        );
        const [rows] = await pool.query('SELECT * FROM adresses WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// DELETE /api/adresses/:id
const remove = async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT * FROM adresses WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Adresse non trouvée' });
        await pool.query('DELETE FROM adresses WHERE id = ?', [req.params.id]);
        res.json({ message: 'Adresse supprimée' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove };
