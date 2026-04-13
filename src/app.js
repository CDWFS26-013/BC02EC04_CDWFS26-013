const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const setupSecurity = require('./middleware/security');

// Routes
const authRoutes = require('./routes/auth.routes');
const chauffeurRoutes = require('./routes/chauffeur.routes');
const tourneeRoutes = require('./routes/tournee.routes');
const livraisonRoutes = require('./routes/livraison.routes');
const clientRoutes = require('./routes/client.routes');
const marchandiseRoutes = require('./routes/marchandise.routes');
const adresseRoutes = require('./routes/adresse.routes');

const app = express();

// Middleware de sécurité (helmet, cors)
setupSecurity(app);

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (interface graphique)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Export Swagger en JSON
app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API LEGENDRE - Documentation'
}));



// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/chauffeurs', chauffeurRoutes);
app.use('/api/tournees', tourneeRoutes);
app.use('/api/livraisons', livraisonRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/marchandises', marchandiseRoutes);
app.use('/api/adresses', adresseRoutes);

// Route racine
app.get('/api', (req, res) => {
    res.json({
        message: 'API Logistique LEGENDRE',
        version: '1.0.0',
        documentation: '/api-docs',
        interface: '/',
        endpoints: {
            auth: '/api/auth',
            chauffeurs: '/api/chauffeurs',
            tournees: '/api/tournees',
            livraisons: '/api/livraisons',
            clients: '/api/clients',
            marchandises: '/api/marchandises',
            adresses: '/api/adresses'
        }
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

module.exports = app;
