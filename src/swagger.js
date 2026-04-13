const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Logistique LEGENDRE',
            version: '1.0.0',
            description: 'API REST sécurisée pour la gestion des tournées de livraison de l\'entreprise LEGENDRE. Permet aux chauffeurs d\'accéder à leurs tournées, aux clients de suivre leurs livraisons et aux systèmes tiers d\'intégrer les données.',
            contact: {
                name: 'LEGENDRE Transport',
                email: 'contact@legendre.fr'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Entrez votre token JWT'
                }
            }
        },
        tags: [
            { name: 'Authentification', description: 'Inscription, connexion et gestion JWT' },
            { name: 'Chauffeurs', description: 'Gestion des chauffeurs' },
            { name: 'Tournées', description: 'Gestion des tournées de livraison' },
            { name: 'Livraisons', description: 'Gestion des livraisons' },
            { name: 'Clients', description: 'Gestion des clients' },
            { name: 'Marchandises', description: 'Gestion des marchandises' },
            { name: 'Adresses', description: 'Gestion des adresses de livraison' }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
