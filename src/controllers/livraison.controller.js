const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// GET /api/livraisons
const getAll = async (req, res) => {
    try {
        let query = `SELECT l.*, cl.nom AS client_nom, a.rue, a.ville, a.code_postal,
                      t.date AS tournee_date, ch.nom AS chauffeur_nom, ch.prenom AS chauffeur_prenom
                      FROM livraisons l
                      JOIN clients cl ON l.client_id = cl.id
                      JOIN adresses a ON l.adresse_id = a.id
                      JOIN tournees t ON l.tournee_id = t.id
                      JOIN chauffeurs ch ON t.chauffeur_id = ch.id`;
        const params = [];

        // Filtrage par rôle
        if (req.user.role === 'chauffeur') {
            query += ' WHERE t.chauffeur_id = ?';
            params.push(req.user.chauffeur_id);
        } else if (req.user.role === 'client') {
            query += ' WHERE l.client_id = ?';
            params.push(req.user.client_id);
        }

        query += ' ORDER BY l.heure_prevue DESC';
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// GET /api/livraisons/:id
const getById = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT l.*, cl.nom AS client_nom, cl.email AS client_email,
                    a.rue, a.ville, a.code_postal, a.pays,
                    t.date AS tournee_date, ch.nom AS chauffeur_nom, ch.prenom AS chauffeur_prenom
             FROM livraisons l
             JOIN clients cl ON l.client_id = cl.id
             JOIN adresses a ON l.adresse_id = a.id
             JOIN tournees t ON l.tournee_id = t.id
             JOIN chauffeurs ch ON t.chauffeur_id = ch.id
             WHERE l.id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Livraison non trouvée' });

        // Restrictions par rôle
        if (req.user.role === 'client' && rows[0].client_id !== req.user.client_id) {
            return res.status(403).json({ error: 'Accès interdit' });
        }
        if (req.user.role === 'chauffeur') {
            const [tournee] = await pool.query('SELECT chauffeur_id FROM tournees WHERE id = ?', [rows[0].tournee_id]);
            if (tournee[0].chauffeur_id !== req.user.chauffeur_id) {
                return res.status(403).json({ error: 'Accès interdit' });
            }
        }

        // Récupérer les marchandises associées
        const [marchandises] = await pool.query(
            `SELECT m.*, lm.quantite
             FROM livraison_marchandises lm
             JOIN marchandises m ON lm.marchandise_id = m.id
             WHERE lm.livraison_id = ?`,
            [req.params.id]
        );

        res.json({ ...rows[0], marchandises });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// POST /api/livraisons
const create = async (req, res) => {
    try {
        const { heure_prevue, statut, tournee_id, client_id, adresse_id, marchandises } = req.body;
        if (!tournee_id || !client_id || !adresse_id) {
            return res.status(400).json({ error: 'tournee_id, client_id et adresse_id sont requis' });
        }

        // Vérifier les FK
        const [t] = await pool.query('SELECT id FROM tournees WHERE id = ?', [tournee_id]);
        if (t.length === 0) return res.status(404).json({ error: 'Tournée non trouvée' });
        const [c] = await pool.query('SELECT id FROM clients WHERE id = ?', [client_id]);
        if (c.length === 0) return res.status(404).json({ error: 'Client non trouvé' });
        const [a] = await pool.query('SELECT id FROM adresses WHERE id = ?', [adresse_id]);
        if (a.length === 0) return res.status(404).json({ error: 'Adresse non trouvée' });

        const id = uuidv4();
        await pool.query(
            'INSERT INTO livraisons (id, heure_prevue, statut, tournee_id, client_id, adresse_id) VALUES (?, ?, ?, ?, ?, ?)',
            [id, heure_prevue || null, statut || 'en_attente', tournee_id, client_id, adresse_id]
        );

        // Ajouter les marchandises si fournies
        if (marchandises && Array.isArray(marchandises)) {
            for (const m of marchandises) {
                await pool.query(
                    'INSERT INTO livraison_marchandises (id, livraison_id, marchandise_id, quantite) VALUES (?, ?, ?, ?)',
                    [uuidv4(), id, m.marchandise_id, m.quantite || 1]
                );
            }
        }

        const [rows] = await pool.query('SELECT * FROM livraisons WHERE id = ?', [id]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// PATCH /api/livraisons/:id/statut
const updateStatut = async (req, res) => {
    try {
        const { statut } = req.body;
        if (!statut || !['en_attente', 'en_cours', 'livree', 'echouee'].includes(statut)) {
            return res.status(400).json({ error: 'Statut invalide (en_attente, en_cours, livree, echouee)' });
        }

        const [existing] = await pool.query('SELECT * FROM livraisons WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Livraison non trouvée' });

        // Un chauffeur ne peut modifier que les livraisons de ses tournées
        if (req.user.role === 'chauffeur') {
            const [tournee] = await pool.query('SELECT chauffeur_id FROM tournees WHERE id = ?', [existing[0].tournee_id]);
            if (tournee[0].chauffeur_id !== req.user.chauffeur_id) {
                return res.status(403).json({ error: 'Accès interdit' });
            }
        }

        await pool.query('UPDATE livraisons SET statut = ? WHERE id = ?', [statut, req.params.id]);
        const [rows] = await pool.query('SELECT * FROM livraisons WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// PUT /api/livraisons/:id
const update = async (req, res) => {
    try {
        const { heure_prevue, statut, tournee_id, client_id, adresse_id } = req.body;
        const [existing] = await pool.query('SELECT * FROM livraisons WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Livraison non trouvée' });

        await pool.query(
            'UPDATE livraisons SET heure_prevue = ?, statut = ?, tournee_id = ?, client_id = ?, adresse_id = ? WHERE id = ?',
            [
                heure_prevue || existing[0].heure_prevue,
                statut || existing[0].statut,
                tournee_id || existing[0].tournee_id,
                client_id || existing[0].client_id,
                adresse_id || existing[0].adresse_id,
                req.params.id
            ]
        );
        const [rows] = await pool.query('SELECT * FROM livraisons WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// DELETE /api/livraisons/:id
const remove = async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT * FROM livraisons WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Livraison non trouvée' });
        await pool.query('DELETE FROM livraisons WHERE id = ?', [req.params.id]);
        res.json({ message: 'Livraison supprimée' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

module.exports = { getAll, getById, create, updateStatut, update, remove };
