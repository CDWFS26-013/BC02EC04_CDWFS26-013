const helmet = require('helmet');
const cors = require('cors');

const setupSecurity = (app) => {
    // Helmet pour les headers de sécurité (CSP désactivé pour Swagger UI)
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    }));

    // CORS
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
};

module.exports = setupSecurity;
