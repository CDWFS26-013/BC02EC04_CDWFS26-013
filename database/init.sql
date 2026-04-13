-- ============================================
-- Base de données : API Logistique LEGENDRE
-- Gestion de tournées de livraison
-- ============================================

DROP DATABASE IF EXISTS legendre_logistique;
CREATE DATABASE legendre_logistique CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE legendre_logistique;

-- ============================================
-- Table des utilisateurs (authentification JWT)
-- ============================================
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'chauffeur', 'client') NOT NULL,
    chauffeur_id CHAR(36) NULL,
    client_id CHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Table Chauffeur
-- ============================================
CREATE TABLE chauffeurs (
    id CHAR(36) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Table Client
-- ============================================
CREATE TABLE clients (
    id CHAR(36) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Table Adresse
-- ============================================
CREATE TABLE adresses (
    id CHAR(36) PRIMARY KEY,
    rue VARCHAR(500) NOT NULL,
    ville VARCHAR(255) NOT NULL,
    code_postal VARCHAR(10) NOT NULL,
    pays VARCHAR(100) NOT NULL DEFAULT 'France',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Table Tournee
-- ============================================
CREATE TABLE tournees (
    id CHAR(36) PRIMARY KEY,
    date DATE NOT NULL,
    chauffeur_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chauffeur_id) REFERENCES chauffeurs(id) ON DELETE CASCADE
);

-- ============================================
-- Table Marchandise
-- ============================================
CREATE TABLE marchandises (
    id CHAR(36) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    poids FLOAT NOT NULL,
    volume FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Table Livraison
-- ============================================
CREATE TABLE livraisons (
    id CHAR(36) PRIMARY KEY,
    heure_prevue DATETIME NULL,
    statut ENUM('en_attente', 'en_cours', 'livree', 'echouee') NOT NULL DEFAULT 'en_attente',
    tournee_id CHAR(36) NOT NULL,
    client_id CHAR(36) NOT NULL,
    adresse_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tournee_id) REFERENCES tournees(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (adresse_id) REFERENCES adresses(id) ON DELETE CASCADE
);

-- ============================================
-- Table Livraison_Marchandise (pivot)
-- ============================================
CREATE TABLE livraison_marchandises (
    id CHAR(36) PRIMARY KEY,
    livraison_id CHAR(36) NOT NULL,
    marchandise_id CHAR(36) NOT NULL,
    quantite INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (livraison_id) REFERENCES livraisons(id) ON DELETE CASCADE,
    FOREIGN KEY (marchandise_id) REFERENCES marchandises(id) ON DELETE CASCADE,
    UNIQUE KEY unique_livraison_marchandise (livraison_id, marchandise_id)
);

-- ============================================
-- Foreign keys sur users
-- ============================================
ALTER TABLE users ADD FOREIGN KEY (chauffeur_id) REFERENCES chauffeurs(id) ON DELETE SET NULL;
ALTER TABLE users ADD FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;

-- ============================================
-- Index pour les performances
-- ============================================
CREATE INDEX idx_tournees_chauffeur ON tournees(chauffeur_id);
CREATE INDEX idx_tournees_date ON tournees(date);
CREATE INDEX idx_livraisons_tournee ON livraisons(tournee_id);
CREATE INDEX idx_livraisons_client ON livraisons(client_id);
CREATE INDEX idx_livraisons_statut ON livraisons(statut);
