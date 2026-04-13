const request = require('supertest');
const app = require('../src/app');

let adminToken;
let chauffeurToken;
let clientToken;
let createdChauffeurId;
let createdClientId;
let createdAdresseId;
let createdMarchandiseId;
let createdTourneeId;
let createdLivraisonId;

// ==========================================
// AUTHENTIFICATION
// ==========================================
describe('Authentification', () => {
    test('POST /api/auth/login - Admin login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@legendre.fr', password: 'password123' });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.role).toBe('admin');
        adminToken = res.body.token;
    });

    test('POST /api/auth/login - Chauffeur login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'jean.dupont@legendre.fr', password: 'password123' });
        expect(res.status).toBe(200);
        expect(res.body.user.role).toBe('chauffeur');
        chauffeurToken = res.body.token;
    });

    test('POST /api/auth/login - Client login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'contact@boulangerie-martin.fr', password: 'password123' });
        expect(res.status).toBe(200);
        expect(res.body.user.role).toBe('client');
        clientToken = res.body.token;
    });

    test('POST /api/auth/login - Echec avec mauvais mot de passe', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@legendre.fr', password: 'mauvais' });
        expect(res.status).toBe(401);
    });

    test('POST /api/auth/login - Echec sans données', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({});
        expect(res.status).toBe(400);
    });

    test('GET /api/auth/me - Informations utilisateur connecté', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body.email).toBe('admin@legendre.fr');
    });

    test('GET /api/auth/me - Echec sans token', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.status).toBe(401);
    });

    test('POST /api/auth/register - Inscription avec email existant', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'admin@legendre.fr', password: 'test', role: 'admin' });
        expect(res.status).toBe(409);
    });
});

// ==========================================
// CHAUFFEURS
// ==========================================
describe('Chauffeurs', () => {
    test('GET /api/chauffeurs - Liste (admin)', async () => {
        const res = await request(app)
            .get('/api/chauffeurs')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /api/chauffeurs - Refusé pour client', async () => {
        const res = await request(app)
            .get('/api/chauffeurs')
            .set('Authorization', `Bearer ${clientToken}`);
        expect(res.status).toBe(403);
    });

    test('POST /api/chauffeurs - Création (admin)', async () => {
        const res = await request(app)
            .post('/api/chauffeurs')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ nom: 'Test', prenom: 'Chauffeur', email: 'test.chauffeur@test.fr', telephone: '0600000000' });
        expect(res.status).toBe(201);
        expect(res.body.nom).toBe('Test');
        createdChauffeurId = res.body.id;
    });

    test('POST /api/chauffeurs - Echec sans données', async () => {
        const res = await request(app)
            .post('/api/chauffeurs')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({});
        expect(res.status).toBe(400);
    });

    test('GET /api/chauffeurs/:id - Détail', async () => {
        const res = await request(app)
            .get(`/api/chauffeurs/${createdChauffeurId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdChauffeurId);
    });

    test('PUT /api/chauffeurs/:id - Modification', async () => {
        const res = await request(app)
            .put(`/api/chauffeurs/${createdChauffeurId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ nom: 'TestModifié', prenom: 'Chauffeur', email: 'test.chauffeur@test.fr', telephone: '0600000000' });
        expect(res.status).toBe(200);
        expect(res.body.nom).toBe('TestModifié');
    });

    test('GET /api/chauffeurs/:id/tournees - Tournées du chauffeur', async () => {
        const res = await request(app)
            .get(`/api/chauffeurs/${createdChauffeurId}/tournees`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

// ==========================================
// CLIENTS
// ==========================================
describe('Clients', () => {
    test('GET /api/clients - Liste (admin)', async () => {
        const res = await request(app)
            .get('/api/clients')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/clients - Création', async () => {
        const res = await request(app)
            .post('/api/clients')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ nom: 'Client Test', email: 'client.test@test.fr', telephone: '0200000000' });
        expect(res.status).toBe(201);
        createdClientId = res.body.id;
    });

    test('GET /api/clients/:id - Détail', async () => {
        const res = await request(app)
            .get(`/api/clients/${createdClientId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });
});

// ==========================================
// ADRESSES
// ==========================================
describe('Adresses', () => {
    test('GET /api/adresses - Liste', async () => {
        const res = await request(app)
            .get('/api/adresses')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/adresses - Création', async () => {
        const res = await request(app)
            .post('/api/adresses')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ rue: '1 rue Test', ville: 'TestVille', code_postal: '00000', pays: 'France' });
        expect(res.status).toBe(201);
        createdAdresseId = res.body.id;
    });

    test('POST /api/adresses - Echec sans données', async () => {
        const res = await request(app)
            .post('/api/adresses')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({});
        expect(res.status).toBe(400);
    });
});

// ==========================================
// MARCHANDISES
// ==========================================
describe('Marchandises', () => {
    test('GET /api/marchandises - Liste', async () => {
        const res = await request(app)
            .get('/api/marchandises')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/marchandises - Création', async () => {
        const res = await request(app)
            .post('/api/marchandises')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ nom: 'Marchandise Test', poids: 10, volume: 0.5 });
        expect(res.status).toBe(201);
        createdMarchandiseId = res.body.id;
    });

    test('GET /api/marchandises/:id - Détail', async () => {
        const res = await request(app)
            .get(`/api/marchandises/${createdMarchandiseId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body.nom).toBe('Marchandise Test');
    });
});

// ==========================================
// TOURNEES
// ==========================================
describe('Tournées', () => {
    test('GET /api/tournees - Liste (admin)', async () => {
        const res = await request(app)
            .get('/api/tournees')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/tournees - Création', async () => {
        const res = await request(app)
            .post('/api/tournees')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ date: '2026-04-15', chauffeur_id: createdChauffeurId });
        expect(res.status).toBe(201);
        createdTourneeId = res.body.id;
    });

    test('POST /api/tournees - Echec sans chauffeur', async () => {
        const res = await request(app)
            .post('/api/tournees')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ date: '2026-04-15' });
        expect(res.status).toBe(400);
    });

    test('GET /api/tournees/:id/livraisons - Livraisons de la tournée', async () => {
        const res = await request(app)
            .get(`/api/tournees/${createdTourneeId}/livraisons`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

// ==========================================
// LIVRAISONS
// ==========================================
describe('Livraisons', () => {
    test('GET /api/livraisons - Liste', async () => {
        const res = await request(app)
            .get('/api/livraisons')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/livraisons - Création', async () => {
        const res = await request(app)
            .post('/api/livraisons')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                tournee_id: createdTourneeId,
                client_id: createdClientId,
                adresse_id: createdAdresseId,
                heure_prevue: '2026-04-15T10:00:00',
                marchandises: [{ marchandise_id: createdMarchandiseId, quantite: 3 }]
            });
        expect(res.status).toBe(201);
        createdLivraisonId = res.body.id;
    });

    test('POST /api/livraisons - Echec sans données', async () => {
        const res = await request(app)
            .post('/api/livraisons')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({});
        expect(res.status).toBe(400);
    });

    test('GET /api/livraisons/:id - Détail avec marchandises', async () => {
        const res = await request(app)
            .get(`/api/livraisons/${createdLivraisonId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body.marchandises).toBeDefined();
        expect(res.body.marchandises.length).toBe(1);
    });

    test('PATCH /api/livraisons/:id/statut - Mise à jour du statut', async () => {
        const res = await request(app)
            .patch(`/api/livraisons/${createdLivraisonId}/statut`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ statut: 'en_cours' });
        expect(res.status).toBe(200);
        expect(res.body.statut).toBe('en_cours');
    });

    test('PATCH /api/livraisons/:id/statut - Statut invalide', async () => {
        const res = await request(app)
            .patch(`/api/livraisons/${createdLivraisonId}/statut`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ statut: 'invalide' });
        expect(res.status).toBe(400);
    });

    test('PATCH /api/livraisons/:id/statut - Livrer', async () => {
        const res = await request(app)
            .patch(`/api/livraisons/${createdLivraisonId}/statut`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ statut: 'livree' });
        expect(res.status).toBe(200);
        expect(res.body.statut).toBe('livree');
    });
});

// ==========================================
// CONTROLE D'ACCES PAR ROLE
// ==========================================
describe('Contrôle d\'accès par rôle', () => {
    test('Client ne peut pas créer de chauffeur', async () => {
        const res = await request(app)
            .post('/api/chauffeurs')
            .set('Authorization', `Bearer ${clientToken}`)
            .send({ nom: 'X', prenom: 'Y', email: 'x@y.fr', telephone: '0600000000' });
        expect(res.status).toBe(403);
    });

    test('Chauffeur ne peut pas créer de tournée', async () => {
        const res = await request(app)
            .post('/api/tournees')
            .set('Authorization', `Bearer ${chauffeurToken}`)
            .send({ date: '2026-04-15', chauffeur_id: createdChauffeurId });
        expect(res.status).toBe(403);
    });

    test('Client ne peut pas supprimer de livraison', async () => {
        const res = await request(app)
            .delete(`/api/livraisons/${createdLivraisonId}`)
            .set('Authorization', `Bearer ${clientToken}`);
        expect(res.status).toBe(403);
    });

    test('Requête sans token retourne 401', async () => {
        const res = await request(app).get('/api/chauffeurs');
        expect(res.status).toBe(401);
    });

    test('Token invalide retourne 401', async () => {
        const res = await request(app)
            .get('/api/chauffeurs')
            .set('Authorization', 'Bearer tokeninvalide');
        expect(res.status).toBe(401);
    });
});

// ==========================================
// NETTOYAGE
// ==========================================
describe('Nettoyage', () => {
    test('DELETE /api/livraisons/:id', async () => {
        const res = await request(app)
            .delete(`/api/livraisons/${createdLivraisonId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });

    test('DELETE /api/tournees/:id', async () => {
        const res = await request(app)
            .delete(`/api/tournees/${createdTourneeId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });

    test('DELETE /api/marchandises/:id', async () => {
        const res = await request(app)
            .delete(`/api/marchandises/${createdMarchandiseId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });

    test('DELETE /api/adresses/:id', async () => {
        const res = await request(app)
            .delete(`/api/adresses/${createdAdresseId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });

    test('DELETE /api/clients/:id', async () => {
        const res = await request(app)
            .delete(`/api/clients/${createdClientId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });

    test('DELETE /api/chauffeurs/:id', async () => {
        const res = await request(app)
            .delete(`/api/chauffeurs/${createdChauffeurId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });
});

// Fermer le pool après les tests
afterAll(async () => {
    const pool = require('../src/config/db');
    await pool.end();
});
