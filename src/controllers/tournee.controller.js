const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// GET /api/tournees
const getAll = async (req, res) => {
    try {
        let query = `SELECT t.*, c.nom AS chauffeur_nom, c.prenom AS chauffeur_prenom
                      FROM tournees t
                      JOIN chauffeurs c ON t.chauffeur_id = c.id`;
        const params = [];

        // Un chauffeur ne voit que ses tournées
        if (req.user.role === 'chauffeur') {
            query += ' WHERE t.chauffeur_id = ?';
            params.push(req.user.chauffeur_id);
        }

        query += ' ORDER BY t.date DESC';
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// GET /api/tournees/:id
const getById = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT t.*, c.nom AS chauffeur_nom, c.prenom AS chauffeur_prenom
             FROM tournees t
             JOIN chauffeurs c ON t.chauffeur_id = c.id
             WHERE t.id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Tournée non trouvée' });

        // Un chauffeur ne voit que ses tournées
        if (req.user.role === 'chauffeur' && rows[0].chauffeur_id !== req.user.chauffeur_id) {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// POST /api/tournees
const create = async (req, res) => {
    try {
        const { date, chauffeur_id } = req.body;
        if (!date || !chauffeur_id) {
            return res.status(400).json({ error: 'Date et chauffeur_id sont requis' });
        }

        const [chauffeur] = await pool.query('SELECT id FROM chauffeurs WHERE id = ?', [chauffeur_id]);
        if (chauffeur.length === 0) return res.status(404).json({ error: 'Chauffeur non trouvé' });

        const id = uuidv4();
        await pool.query(
            'INSERT INTO tournees (id, date, chauffeur_id) VALUES (?, ?, ?)',
            [id, date, chauffeur_id]
        );
        const [rows] = await pool.query(
            `SELECT t.*, c.nom AS chauffeur_nom, c.prenom AS chauffeur_prenom
             FROM tournees t JOIN chauffeurs c ON t.chauffeur_id = c.id WHERE t.id = ?`,
            [id]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// PUT /api/tournees/:id
const update = async (req, res) => {
    try {
        const { date, chauffeur_id } = req.body;
        const [existing] = await pool.query('SELECT * FROM tournees WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Tournée non trouvée' });

        if (chauffeur_id) {
            const [ch] = await pool.query('SELECT id FROM chauffeurs WHERE id = ?', [chauffeur_id]);
            if (ch.length === 0) return res.status(404).json({ error: 'Chauffeur non trouvé' });
        }

        await pool.query(
            'UPDATE tournees SET date = ?, chauffeur_id = ? WHERE id = ?',
            [date || existing[0].date, chauffeur_id || existing[0].chauffeur_id, req.params.id]
        );
        const [rows] = await pool.query(
            `SELECT t.*, c.nom AS chauffeur_nom, c.prenom AS chauffeur_prenom
             FROM tournees t JOIN chauffeurs c ON t.chauffeur_id = c.id WHERE t.id = ?`,
            [req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// DELETE /api/tournees/:id
const remove = async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT * FROM tournees WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Tournée non trouvée' });
        await pool.query('DELETE FROM tournees WHERE id = ?', [req.params.id]);
        res.json({ message: 'Tournée supprimée' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// GET /api/tournees/:id/livraisons
const getLivraisons = async (req, res) => {
    try {
        const [tournee] = await pool.query('SELECT * FROM tournees WHERE id = ?', [req.params.id]);
        if (tournee.length === 0) return res.status(404).json({ error: 'Tournée non trouvée' });

        // Un chauffeur ne voit que ses tournées
        if (req.user.role === 'chauffeur' && tournee[0].chauffeur_id !== req.user.chauffeur_id) {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        const [rows] = await pool.query(
            `SELECT l.*, cl.nom AS client_nom, a.rue, a.ville, a.code_postal
             FROM livraisons l
             JOIN clients cl ON l.client_id = cl.id
             JOIN adresses a ON l.adresse_id = a.id
             WHERE l.tournee_id = ?
             ORDER BY l.heure_prevue`,
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove, getLivraisons };
