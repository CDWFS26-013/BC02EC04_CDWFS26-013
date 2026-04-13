# LEGENDRE Logistique - API et Interface Web

Application de gestion logistique pour l'entreprise LEGENDRE avec API REST et interface web modulaire.

## 🎯 Description

Système complet de gestion des tournées, livraisons, chauffeurs, clients, marchandises et adresses avec authentification par rôles (admin, chauffeur, client).

## 📁 Structure du Projet

```
├── src/                        # Backend Node.js/Express
│   ├── app.js                 # Point d'entrée
│   ├── server.js              # Configuration serveur
│   ├── config/                # Configuration BD
│   ├── controllers/           # Logique métier
│   ├── routes/                # Endpoints API
│   ├── middleware/            # Authentification & sécurité
│   └── swagger.js             # Documentation API
├── database/
│   ├── init.sql              # Schéma BD
│   └── seed.js               # Données de test
├── public/                     # Frontend HTML/CSS/JS
│   ├── index.html            # Page LOGIN uniquement
│   ├── dashboard.html        # Tableau de bord
│   ├── chauffeurs.html       # Gestion chauffeurs
│   ├── tournees.html         # Gestion tournées
│   ├── livraisons.html       # Gestion livraisons
│   ├── clients.html          # Gestion clients
│   ├── marchandises.html     # Gestion marchandises
│   ├── adresses.html         # Gestion adresses
│   ├── css/styles.css        # Styles centralisés
│   └── js/app.js             # Fonctions communes
└── package.json              # Dépendances Node
```

## 🚀 Démarrage Rapide

### 1. Installation
```bash
npm install
```

### 2. Configuration
Créer un fichier `.env` à la racine :
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=legendre_logistique
DB_PORT=3306
JWT_SECRET=your_secret_key
PORT=3000
```

### 3. Initialiser la Base de Données
```bash
node database/init.sql          # Créer les tables
node database/seed.js           # Charger les données de test
```

### 4. Lancer l'application
```bash
npm start
```

L'app démarre sur `http://localhost:3000`

## 👥 Utilisateurs de Test

Mot de passe par défaut : **password123**

| Email | Rôle | Usage |
|-------|------|-------|
| admin@legendre.fr | admin | Accès total |
| jean.dupont@legendre.fr | chauffeur | Voir ses tournées |
| pierre.martin@legendre.fr | chauffeur | Voir ses tournées |
| contact@boulangerie-martin.fr | client | Voir ses livraisons |
| commandes@legourmet.fr | client | Voir ses livraisons |

## 🔗 Endpoints API

Tous les endpoints sont préfixés par `/api/`

### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription
- `GET /auth/me` - Profil courant

### Ressources
- `GET/POST /chauffeurs` - Chauffeurs
- `GET/POST /tournees` - Tournées
- `GET/POST /livraisons` - Livraisons
- `GET/POST /clients` - Clients
- `GET/POST /marchandises` - Marchandises
- `GET/POST /adresses` - Adresses

**Documentation Swagger** : http://localhost:3000/api-docs

## 🏗️ Architecture Frontend

### Navigation
```
index.html (LOGIN)
    ↓ (après connexion)
dashboard.html
    ├── chauffeurs.html
    ├── tournees.html
    ├── livraisons.html
    ├── clients.html
    ├── marchandises.html
    └── adresses.html
```

Chaque page appelle son endpoint API correspondant : `/api/{ressource}`

### Fichiers Partagés
- `css/styles.css` - Design unique
- `js/app.js` - Fonctions communes (API, authentification, helpers)

## 🔐 Authentification

Token JWT stocké dans `localStorage` et envoyé dans chaque requête :
```javascript
Authorization: Bearer <token>
```

Session expirée → redirection vers login

## 🛠️ Technologies

- **Backend** : Node.js, Express, MySQL, JWT
- **Frontend** : HTML5, CSS3, Vanilla JavaScript
- **API** : REST, Swagger/OpenAPI
- **Sécurité** : Bcrypt, CORS, Helmet

## 📝 Fonctionnalités Principales

✅ Gestion complète des chauffeurs, tournées, livraisons  
✅ Suivi du statut des livraisons (en_attente, en_cours, livrée, échouée)  
✅ Permissions par rôle (admin, chauffeur, client)  
✅ Interface responsive et modulaire  
✅ Documentation API interactive (Swagger)

## 💡 Notes

- Chaque page HTML est **indépendante** et modulaire
- Appels API avec gestion automatique du token
- Design cohérent via CSS centralisé
- Code facile à maintenir et étendre

---

**Besoin d'aide ?** Consultez `/api-docs` pour explorer l'API interactivement.
