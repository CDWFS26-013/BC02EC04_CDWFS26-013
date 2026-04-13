const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function seed() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });

    console.log('Nettoyage des tables...');
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    const tables = ['livraison_marchandises', 'livraisons', 'tournees', 'users', 'chauffeurs', 'clients', 'adresses', 'marchandises'];
    for (const t of tables) await pool.query(`TRUNCATE TABLE ${t}`);
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Création des chauffeurs...');
    const chauffeurs = [
        { id: uuidv4(), nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@legendre.fr', telephone: '0612345678' },
        { id: uuidv4(), nom: 'Martin', prenom: 'Pierre', email: 'pierre.martin@legendre.fr', telephone: '0623456789' },
        { id: uuidv4(), nom: 'Bernard', prenom: 'Luc', email: 'luc.bernard@legendre.fr', telephone: '0634567890' }
    ];
    for (const c of chauffeurs) {
        await pool.query('INSERT INTO chauffeurs (id, nom, prenom, email, telephone) VALUES (?, ?, ?, ?, ?)',
            [c.id, c.nom, c.prenom, c.email, c.telephone]);
    }

    console.log('Création des clients...');
    const clients = [
        { id: uuidv4(), nom: 'Boulangerie Martin', email: 'contact@boulangerie-martin.fr', telephone: '0234567890' },
        { id: uuidv4(), nom: 'Restaurant Le Gourmet', email: 'commandes@legourmet.fr', telephone: '0234567891' },
        { id: uuidv4(), nom: 'Supermarché Central', email: 'logistique@supercentral.fr', telephone: '0234567892' },
        { id: uuidv4(), nom: 'Pharmacie Santé Plus', email: 'reception@santeplus.fr', telephone: '0234567893' },
        { id: uuidv4(), nom: 'Librairie du Coin', email: 'commandes@librairieducoin.fr', telephone: '0234567894' }
    ];
    for (const c of clients) {
        await pool.query('INSERT INTO clients (id, nom, email, telephone) VALUES (?, ?, ?, ?)',
            [c.id, c.nom, c.email, c.telephone]);
    }

    console.log('Création des adresses...');
    const adresses = [
        { id: uuidv4(), rue: '12 rue de la Paix', ville: 'Chartres', code_postal: '28000', pays: 'France' },
        { id: uuidv4(), rue: '45 avenue de la République', ville: 'Dreux', code_postal: '28100', pays: 'France' },
        { id: uuidv4(), rue: '8 place du Marché', ville: 'Nogent-le-Rotrou', code_postal: '28400', pays: 'France' },
        { id: uuidv4(), rue: '23 boulevard Victor Hugo', ville: 'Châteaudun', code_postal: '28200', pays: 'France' },
        { id: uuidv4(), rue: '6 rue des Fleurs', ville: 'Chartres', code_postal: '28000', pays: 'France' }
    ];
    for (const a of adresses) {
        await pool.query('INSERT INTO adresses (id, rue, ville, code_postal, pays) VALUES (?, ?, ?, ?, ?)',
            [a.id, a.rue, a.ville, a.code_postal, a.pays]);
    }

    console.log('Création des marchandises...');
    const marchandises = [
        { id: uuidv4(), nom: 'Palette de farine', poids: 500, volume: 1.2 },
        { id: uuidv4(), nom: 'Carton de conserves', poids: 25, volume: 0.3 },
        { id: uuidv4(), nom: 'Caisse de fruits', poids: 15, volume: 0.5 },
        { id: uuidv4(), nom: 'Pack de bouteilles d\'eau', poids: 12, volume: 0.2 },
        { id: uuidv4(), nom: 'Sac de riz 25kg', poids: 25, volume: 0.15 }
    ];
    for (const m of marchandises) {
        await pool.query('INSERT INTO marchandises (id, nom, poids, volume) VALUES (?, ?, ?, ?)',
            [m.id, m.nom, m.poids, m.volume]);
    }

    console.log('Création des tournées...');
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const tournees = [
        { id: uuidv4(), date: today, chauffeur_id: chauffeurs[0].id },
        { id: uuidv4(), date: today, chauffeur_id: chauffeurs[1].id },
        { id: uuidv4(), date: yesterday, chauffeur_id: chauffeurs[0].id },
        { id: uuidv4(), date: yesterday, chauffeur_id: chauffeurs[2].id }
    ];
    for (const t of tournees) {
        await pool.query('INSERT INTO tournees (id, date, chauffeur_id) VALUES (?, ?, ?)',
            [t.id, t.date, t.chauffeur_id]);
    }

    console.log('Création des livraisons...');
    const livraisons = [
        { id: uuidv4(), heure_prevue: `${today} 09:00:00`, statut: 'en_attente', tournee_id: tournees[0].id, client_id: clients[0].id, adresse_id: adresses[0].id },
        { id: uuidv4(), heure_prevue: `${today} 10:30:00`, statut: 'en_cours', tournee_id: tournees[0].id, client_id: clients[1].id, adresse_id: adresses[1].id },
        { id: uuidv4(), heure_prevue: `${today} 14:00:00`, statut: 'en_attente', tournee_id: tournees[1].id, client_id: clients[2].id, adresse_id: adresses[2].id },
        { id: uuidv4(), heure_prevue: `${yesterday} 09:00:00`, statut: 'livree', tournee_id: tournees[2].id, client_id: clients[3].id, adresse_id: adresses[3].id },
        { id: uuidv4(), heure_prevue: `${yesterday} 11:00:00`, statut: 'livree', tournee_id: tournees[3].id, client_id: clients[4].id, adresse_id: adresses[4].id },
        { id: uuidv4(), heure_prevue: `${yesterday} 15:00:00`, statut: 'echouee', tournee_id: tournees[2].id, client_id: clients[0].id, adresse_id: adresses[0].id }
    ];
    for (const l of livraisons) {
        await pool.query('INSERT INTO livraisons (id, heure_prevue, statut, tournee_id, client_id, adresse_id) VALUES (?, ?, ?, ?, ?, ?)',
            [l.id, l.heure_prevue, l.statut, l.tournee_id, l.client_id, l.adresse_id]);
    }

    console.log('Ajout des marchandises aux livraisons...');
    const lm = [
        { livraison_id: livraisons[0].id, marchandise_id: marchandises[0].id, quantite: 2 },
        { livraison_id: livraisons[0].id, marchandise_id: marchandises[1].id, quantite: 5 },
        { livraison_id: livraisons[1].id, marchandise_id: marchandises[2].id, quantite: 10 },
        { livraison_id: livraisons[1].id, marchandise_id: marchandises[3].id, quantite: 20 },
        { livraison_id: livraisons[2].id, marchandise_id: marchandises[4].id, quantite: 8 },
        { livraison_id: livraisons[3].id, marchandise_id: marchandises[0].id, quantite: 1 },
        { livraison_id: livraisons[4].id, marchandise_id: marchandises[1].id, quantite: 3 },
        { livraison_id: livraisons[5].id, marchandise_id: marchandises[2].id, quantite: 6 }
    ];
    for (const item of lm) {
        await pool.query('INSERT INTO livraison_marchandises (id, livraison_id, marchandise_id, quantite) VALUES (?, ?, ?, ?)',
            [uuidv4(), item.livraison_id, item.marchandise_id, item.quantite]);
    }

    console.log('Création des utilisateurs...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
        { id: uuidv4(), email: 'admin@legendre.fr', password: hashedPassword, role: 'admin', chauffeur_id: null, client_id: null },
        { id: uuidv4(), email: 'jean.dupont@legendre.fr', password: hashedPassword, role: 'chauffeur', chauffeur_id: chauffeurs[0].id, client_id: null },
        { id: uuidv4(), email: 'pierre.martin@legendre.fr', password: hashedPassword, role: 'chauffeur', chauffeur_id: chauffeurs[1].id, client_id: null },
        { id: uuidv4(), email: 'contact@boulangerie-martin.fr', password: hashedPassword, role: 'client', chauffeur_id: null, client_id: clients[0].id },
        { id: uuidv4(), email: 'commandes@legourmet.fr', password: hashedPassword, role: 'client', chauffeur_id: null, client_id: clients[1].id }
    ];
    for (const u of users) {
        await pool.query('INSERT INTO users (id, email, password, role, chauffeur_id, client_id) VALUES (?, ?, ?, ?, ?, ?)',
            [u.id, u.email, u.password, u.role, u.chauffeur_id, u.client_id]);
    }

    console.log('\n=== Seed terminé avec succès ===');
    console.log('\nComptes disponibles (mot de passe: password123):');
    console.log('  Admin:     admin@legendre.fr');
    console.log('  Chauffeur: jean.dupont@legendre.fr');
    console.log('  Chauffeur: pierre.martin@legendre.fr');
    console.log('  Client:    contact@boulangerie-martin.fr');
    console.log('  Client:    commandes@legourmet.fr');

    await pool.end();
    process.exit(0);
}

seed().catch(err => {
    console.error('Erreur seed:', err);
    process.exit(1);
});
