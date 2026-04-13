-- ============================================
-- DUMP DE LA BASE DE DONNÉES LEGENDRE LOGISTIQUE
-- Généré le: 13/04/2026 15:31:05
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;


-- ============================================
-- Table: adresses
-- ============================================
DROP TABLE IF EXISTS `adresses`;

CREATE TABLE `adresses` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rue` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_postal` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pays` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'France',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de adresses
INSERT INTO `adresses` (`id`, `rue`, `ville`, `code_postal`, `pays`, `created_at`, `updated_at`) VALUES ('07a01c6b-695e-47e8-bbfc-b3c18bb2e503', '12 rue de la Paix', 'Chartres', '28000', 'France', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `adresses` (`id`, `rue`, `ville`, `code_postal`, `pays`, `created_at`, `updated_at`) VALUES ('57777984-0975-4322-915d-44a91d3ff990', '8 place du Marché', 'Nogent-le-Rotrou', '28400', 'France', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `adresses` (`id`, `rue`, `ville`, `code_postal`, `pays`, `created_at`, `updated_at`) VALUES ('7e969e85-7694-4f92-b139-1f65968e6d62', '6 rue des Fleurs', 'Chartres', '28000', 'France', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `adresses` (`id`, `rue`, `ville`, `code_postal`, `pays`, `created_at`, `updated_at`) VALUES ('7ed8c66b-1c66-4e72-a441-3ab4ceb0ff69', '45 avenue de la République', 'Dreux', '28100', 'France', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `adresses` (`id`, `rue`, `ville`, `code_postal`, `pays`, `created_at`, `updated_at`) VALUES ('d69a2858-4264-49a4-a36b-223a477d7aed', '23 boulevard Victor Hugo', 'Châteaudun', '28200', 'France', '2026-04-13 12:24:34', '2026-04-13 12:24:34');


-- ============================================
-- Table: chauffeurs
-- ============================================
DROP TABLE IF EXISTS `chauffeurs`;

CREATE TABLE `chauffeurs` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de chauffeurs
INSERT INTO `chauffeurs` (`id`, `nom`, `prenom`, `email`, `telephone`, `created_at`, `updated_at`) VALUES ('6a233b30-ae69-4133-84f5-625ef13ba15e', 'Martin', 'Pierre', 'pierre.martin@legendre.fr', '0623456789', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `chauffeurs` (`id`, `nom`, `prenom`, `email`, `telephone`, `created_at`, `updated_at`) VALUES ('872d7491-6d21-4883-8fcc-79cea6e3ef3d', 'Dupont', 'Jean', 'jean.dupont@legendre.fr', '0612345678', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `chauffeurs` (`id`, `nom`, `prenom`, `email`, `telephone`, `created_at`, `updated_at`) VALUES ('9e5baf7d-e9ae-4676-9778-2bb101e543a1', 'Bernard', 'Luc', 'luc.bernard@legendre.fr', '0634567890', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `chauffeurs` (`id`, `nom`, `prenom`, `email`, `telephone`, `created_at`, `updated_at`) VALUES ('b3fcf991-ef11-44a3-8384-d783fe54a114', 'Chauffeur', 'test', 'chauffeurtest@legendre.com', '0745589874', '2026-04-13 12:31:14', '2026-04-13 12:31:14');
INSERT INTO `chauffeurs` (`id`, `nom`, `prenom`, `email`, `telephone`, `created_at`, `updated_at`) VALUES ('d75dfefc-4c18-43f6-a970-782592cb23eb', 'Claude', 'AI', 'claude.ia@legendre.fr', '0750656380', '2026-04-13 13:24:05', '2026-04-13 13:24:05');


-- ============================================
-- Table: clients
-- ============================================
DROP TABLE IF EXISTS `clients`;

CREATE TABLE `clients` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de clients
INSERT INTO `clients` (`id`, `nom`, `email`, `telephone`, `created_at`, `updated_at`) VALUES ('395145ef-3e7f-49ad-8e35-46d90321c270', 'Restaurant Le Gourmet', 'commandes@legourmet.fr', '0234567891', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `clients` (`id`, `nom`, `email`, `telephone`, `created_at`, `updated_at`) VALUES ('54efd733-39a6-4922-9755-df42c9e8e255', 'Pharmacie Santé Plus', 'reception@santeplus.fr', '0234567893', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `clients` (`id`, `nom`, `email`, `telephone`, `created_at`, `updated_at`) VALUES ('7cef1691-d19d-4236-8216-1c41b7884b1a', 'Librairie du Coin', 'commandes@librairieducoin.fr', '0234567894', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `clients` (`id`, `nom`, `email`, `telephone`, `created_at`, `updated_at`) VALUES ('c4f3367a-35f7-48b8-a165-f31c7cb1bca9', 'Supermarché Central', 'logistique@supercentral.fr', '0234567892', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `clients` (`id`, `nom`, `email`, `telephone`, `created_at`, `updated_at`) VALUES ('ceb0d7af-15c2-4c04-8a9b-f453caad4293', 'Boulangerie Martin', 'contact@boulangerie-martin.fr', '0234567890', '2026-04-13 12:24:34', '2026-04-13 12:24:34');


-- ============================================
-- Table: livraison_marchandises
-- ============================================
DROP TABLE IF EXISTS `livraison_marchandises`;

CREATE TABLE `livraison_marchandises` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `livraison_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `marchandise_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantite` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_livraison_marchandise` (`livraison_id`,`marchandise_id`),
  KEY `marchandise_id` (`marchandise_id`),
  CONSTRAINT `livraison_marchandises_ibfk_1` FOREIGN KEY (`livraison_id`) REFERENCES `livraisons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `livraison_marchandises_ibfk_2` FOREIGN KEY (`marchandise_id`) REFERENCES `marchandises` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de livraison_marchandises
INSERT INTO `livraison_marchandises` (`id`, `livraison_id`, `marchandise_id`, `quantite`, `created_at`) VALUES ('394b665d-df37-4e2e-8e0e-6712e677a8ca', 'a54a4535-dae6-411a-8b28-affa3e693b50', 'e963923a-6128-4660-93f4-afeb553c876e', 2, '2026-04-13 12:24:34');
INSERT INTO `livraison_marchandises` (`id`, `livraison_id`, `marchandise_id`, `quantite`, `created_at`) VALUES ('957cb4e0-a154-4ddd-868b-741c68b16856', '89bc1f28-351a-44aa-821b-231c4f9d98d4', 'fd6516c4-4878-4212-90d0-4ea8c8fbf23c', 3, '2026-04-13 12:32:06');
INSERT INTO `livraison_marchandises` (`id`, `livraison_id`, `marchandise_id`, `quantite`, `created_at`) VALUES ('98a6ec16-e61e-48d8-b6a2-17e187492a7e', 'f71d7e04-88db-46a1-8730-1ad94348b077', 'fd6516c4-4878-4212-90d0-4ea8c8fbf23c', 10, '2026-04-13 12:24:34');
INSERT INTO `livraison_marchandises` (`id`, `livraison_id`, `marchandise_id`, `quantite`, `created_at`) VALUES ('9cc9a359-a8c9-4c18-ade1-68d8a20867cf', '450f64d6-98ff-4c46-9610-28e0b5a33bd8', 'e963923a-6128-4660-93f4-afeb553c876e', 1, '2026-04-13 12:24:34');
INSERT INTO `livraison_marchandises` (`id`, `livraison_id`, `marchandise_id`, `quantite`, `created_at`) VALUES ('9dea5aca-c25e-429e-90ab-d1638ca17960', 'a54a4535-dae6-411a-8b28-affa3e693b50', 'a874a830-e7ed-4184-b01c-89082d94791f', 5, '2026-04-13 12:24:34');
INSERT INTO `livraison_marchandises` (`id`, `livraison_id`, `marchandise_id`, `quantite`, `created_at`) VALUES ('a57fe37d-802d-44bb-8911-eb61f8509a11', '534789cb-b211-4e34-8688-99997ec06108', 'ff4ae4d0-c6bf-4192-ba9e-49cb8d13e84a', 8, '2026-04-13 12:24:34');
INSERT INTO `livraison_marchandises` (`id`, `livraison_id`, `marchandise_id`, `quantite`, `created_at`) VALUES ('a609fdfc-c227-41f1-9d79-96e10cf9af92', '648faa2b-5930-43d2-bd11-348fb59862d2', 'a874a830-e7ed-4184-b01c-89082d94791f', 3, '2026-04-13 12:24:34');
INSERT INTO `livraison_marchandises` (`id`, `livraison_id`, `marchandise_id`, `quantite`, `created_at`) VALUES ('bac951df-499c-4be3-af49-a41abb251c59', 'fb1e43d3-192d-4d59-8480-78475442251d', 'fd6516c4-4878-4212-90d0-4ea8c8fbf23c', 6, '2026-04-13 12:24:34');
INSERT INTO `livraison_marchandises` (`id`, `livraison_id`, `marchandise_id`, `quantite`, `created_at`) VALUES ('ce9be6a2-06c2-48f7-8cfc-10a8de3ad9b2', '89bc1f28-351a-44aa-821b-231c4f9d98d4', 'a874a830-e7ed-4184-b01c-89082d94791f', 1, '2026-04-13 12:32:06');
INSERT INTO `livraison_marchandises` (`id`, `livraison_id`, `marchandise_id`, `quantite`, `created_at`) VALUES ('e8a2f719-4d9d-48e4-850a-ef145652a3ad', 'f71d7e04-88db-46a1-8730-1ad94348b077', '864c97e7-c1f8-45e9-8e2f-bdfd0342ae4a', 20, '2026-04-13 12:24:34');


-- ============================================
-- Table: livraisons
-- ============================================
DROP TABLE IF EXISTS `livraisons`;

CREATE TABLE `livraisons` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `heure_prevue` datetime DEFAULT NULL,
  `statut` enum('en_attente','en_cours','livree','echouee') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `tournee_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `adresse_id` (`adresse_id`),
  KEY `idx_livraisons_tournee` (`tournee_id`),
  KEY `idx_livraisons_client` (`client_id`),
  KEY `idx_livraisons_statut` (`statut`),
  CONSTRAINT `livraisons_ibfk_1` FOREIGN KEY (`tournee_id`) REFERENCES `tournees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `livraisons_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `livraisons_ibfk_3` FOREIGN KEY (`adresse_id`) REFERENCES `adresses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de livraisons
INSERT INTO `livraisons` (`id`, `heure_prevue`, `statut`, `tournee_id`, `client_id`, `adresse_id`, `created_at`, `updated_at`) VALUES ('450f64d6-98ff-4c46-9610-28e0b5a33bd8', '2026-04-12 07:00:00', 'livree', '14fa04ab-9f08-4495-8587-36eac3a4b419', '54efd733-39a6-4922-9755-df42c9e8e255', 'd69a2858-4264-49a4-a36b-223a477d7aed', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `livraisons` (`id`, `heure_prevue`, `statut`, `tournee_id`, `client_id`, `adresse_id`, `created_at`, `updated_at`) VALUES ('534789cb-b211-4e34-8688-99997ec06108', '2026-04-13 12:00:00', 'en_attente', '668b5ed5-4601-4e9e-8a97-51b79fc6421e', 'c4f3367a-35f7-48b8-a165-f31c7cb1bca9', '57777984-0975-4322-915d-44a91d3ff990', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `livraisons` (`id`, `heure_prevue`, `statut`, `tournee_id`, `client_id`, `adresse_id`, `created_at`, `updated_at`) VALUES ('648faa2b-5930-43d2-bd11-348fb59862d2', '2026-04-12 09:00:00', 'livree', 'b8d98e7e-159a-4772-a993-bb0f9cf2197e', '7cef1691-d19d-4236-8216-1c41b7884b1a', '7e969e85-7694-4f92-b139-1f65968e6d62', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `livraisons` (`id`, `heure_prevue`, `statut`, `tournee_id`, `client_id`, `adresse_id`, `created_at`, `updated_at`) VALUES ('89bc1f28-351a-44aa-821b-231c4f9d98d4', '2026-04-03 11:30:00', 'en_attente', '4596f55e-9a0e-4fba-994a-6bbf7d6780cb', '395145ef-3e7f-49ad-8e35-46d90321c270', '7ed8c66b-1c66-4e72-a441-3ab4ceb0ff69', '2026-04-13 12:32:06', '2026-04-13 12:32:06');
INSERT INTO `livraisons` (`id`, `heure_prevue`, `statut`, `tournee_id`, `client_id`, `adresse_id`, `created_at`, `updated_at`) VALUES ('9866fecd-82cb-49c7-87c5-12fd8f75a192', '2026-04-13 11:24:00', 'en_cours', '85b74f8b-5f96-4860-aa9f-ef289a98e69f', 'ceb0d7af-15c2-4c04-8a9b-f453caad4293', '07a01c6b-695e-47e8-bbfc-b3c18bb2e503', '2026-04-13 13:24:41', '2026-04-13 13:24:41');
INSERT INTO `livraisons` (`id`, `heure_prevue`, `statut`, `tournee_id`, `client_id`, `adresse_id`, `created_at`, `updated_at`) VALUES ('a54a4535-dae6-411a-8b28-affa3e693b50', '2026-04-13 07:00:00', 'en_attente', 'b3993e75-ca1e-48da-a72f-e714eb191d7f', 'ceb0d7af-15c2-4c04-8a9b-f453caad4293', '07a01c6b-695e-47e8-bbfc-b3c18bb2e503', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `livraisons` (`id`, `heure_prevue`, `statut`, `tournee_id`, `client_id`, `adresse_id`, `created_at`, `updated_at`) VALUES ('f71d7e04-88db-46a1-8730-1ad94348b077', '2026-04-13 08:30:00', 'en_cours', 'b3993e75-ca1e-48da-a72f-e714eb191d7f', '395145ef-3e7f-49ad-8e35-46d90321c270', '7ed8c66b-1c66-4e72-a441-3ab4ceb0ff69', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `livraisons` (`id`, `heure_prevue`, `statut`, `tournee_id`, `client_id`, `adresse_id`, `created_at`, `updated_at`) VALUES ('fb1e43d3-192d-4d59-8480-78475442251d', '2026-04-12 13:00:00', 'echouee', '14fa04ab-9f08-4495-8587-36eac3a4b419', 'ceb0d7af-15c2-4c04-8a9b-f453caad4293', '07a01c6b-695e-47e8-bbfc-b3c18bb2e503', '2026-04-13 12:24:34', '2026-04-13 12:24:34');


-- ============================================
-- Table: marchandises
-- ============================================
DROP TABLE IF EXISTS `marchandises`;

CREATE TABLE `marchandises` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `poids` float NOT NULL,
  `volume` float NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de marchandises
INSERT INTO `marchandises` (`id`, `nom`, `poids`, `volume`, `created_at`, `updated_at`) VALUES ('864c97e7-c1f8-45e9-8e2f-bdfd0342ae4a', 'Pack de bouteilles d''eau', 12, 0.2, '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `marchandises` (`id`, `nom`, `poids`, `volume`, `created_at`, `updated_at`) VALUES ('a874a830-e7ed-4184-b01c-89082d94791f', 'Carton de conserves', 25, 0.3, '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `marchandises` (`id`, `nom`, `poids`, `volume`, `created_at`, `updated_at`) VALUES ('e963923a-6128-4660-93f4-afeb553c876e', 'Palette de farine', 500, 1.2, '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `marchandises` (`id`, `nom`, `poids`, `volume`, `created_at`, `updated_at`) VALUES ('fd6516c4-4878-4212-90d0-4ea8c8fbf23c', 'Caisse de fruits', 15, 0.5, '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `marchandises` (`id`, `nom`, `poids`, `volume`, `created_at`, `updated_at`) VALUES ('ff4ae4d0-c6bf-4192-ba9e-49cb8d13e84a', 'Sac de riz 25kg', 25, 0.15, '2026-04-13 12:24:34', '2026-04-13 12:24:34');


-- ============================================
-- Table: tournees
-- ============================================
DROP TABLE IF EXISTS `tournees`;

CREATE TABLE `tournees` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `chauffeur_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tournees_chauffeur` (`chauffeur_id`),
  KEY `idx_tournees_date` (`date`),
  CONSTRAINT `tournees_ibfk_1` FOREIGN KEY (`chauffeur_id`) REFERENCES `chauffeurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de tournees
INSERT INTO `tournees` (`id`, `date`, `chauffeur_id`, `created_at`, `updated_at`) VALUES ('14fa04ab-9f08-4495-8587-36eac3a4b419', '2026-04-11 22:00:00', '872d7491-6d21-4883-8fcc-79cea6e3ef3d', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `tournees` (`id`, `date`, `chauffeur_id`, `created_at`, `updated_at`) VALUES ('4596f55e-9a0e-4fba-994a-6bbf7d6780cb', '2026-03-12 23:00:00', '872d7491-6d21-4883-8fcc-79cea6e3ef3d', '2026-04-13 12:31:41', '2026-04-13 12:34:47');
INSERT INTO `tournees` (`id`, `date`, `chauffeur_id`, `created_at`, `updated_at`) VALUES ('668b5ed5-4601-4e9e-8a97-51b79fc6421e', '2026-04-12 22:00:00', '6a233b30-ae69-4133-84f5-625ef13ba15e', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `tournees` (`id`, `date`, `chauffeur_id`, `created_at`, `updated_at`) VALUES ('85b74f8b-5f96-4860-aa9f-ef289a98e69f', '2026-04-12 22:00:00', 'd75dfefc-4c18-43f6-a970-782592cb23eb', '2026-04-13 13:24:33', '2026-04-13 13:24:33');
INSERT INTO `tournees` (`id`, `date`, `chauffeur_id`, `created_at`, `updated_at`) VALUES ('b3993e75-ca1e-48da-a72f-e714eb191d7f', '2026-04-12 22:00:00', '872d7491-6d21-4883-8fcc-79cea6e3ef3d', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `tournees` (`id`, `date`, `chauffeur_id`, `created_at`, `updated_at`) VALUES ('b8d98e7e-159a-4772-a993-bb0f9cf2197e', '2026-04-11 22:00:00', '9e5baf7d-e9ae-4676-9778-2bb101e543a1', '2026-04-13 12:24:34', '2026-04-13 12:24:34');


-- ============================================
-- Table: users
-- ============================================
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','chauffeur','client') COLLATE utf8mb4_unicode_ci NOT NULL,
  `chauffeur_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `chauffeur_id` (`chauffeur_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`chauffeur_id`) REFERENCES `chauffeurs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de users
INSERT INTO `users` (`id`, `email`, `password`, `role`, `chauffeur_id`, `client_id`, `created_at`, `updated_at`) VALUES ('07c2b196-b7d6-4a18-a1f8-d3ba5bc7829d', 'jean.dupont@legendre.fr', '$2b$10$TKdgYycs20YT1fsL9uzjzuR8uRdJLsKCy1Wa4NXy7o5NEyE00z2ie', 'chauffeur', '872d7491-6d21-4883-8fcc-79cea6e3ef3d', NULL, '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `users` (`id`, `email`, `password`, `role`, `chauffeur_id`, `client_id`, `created_at`, `updated_at`) VALUES ('0b58271e-d2d2-4bfe-bb00-228214d69350', 'contact@boulangerie-martin.fr', '$2b$10$TKdgYycs20YT1fsL9uzjzuR8uRdJLsKCy1Wa4NXy7o5NEyE00z2ie', 'client', NULL, 'ceb0d7af-15c2-4c04-8a9b-f453caad4293', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `users` (`id`, `email`, `password`, `role`, `chauffeur_id`, `client_id`, `created_at`, `updated_at`) VALUES ('276cc7d3-ecfa-467f-99ea-51ca2f80740a', 'admin@legendre.fr', '$2b$10$TKdgYycs20YT1fsL9uzjzuR8uRdJLsKCy1Wa4NXy7o5NEyE00z2ie', 'admin', NULL, NULL, '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `users` (`id`, `email`, `password`, `role`, `chauffeur_id`, `client_id`, `created_at`, `updated_at`) VALUES ('394d5c73-ffa4-4beb-819f-dc5a025d292b', 'cdwfs2613@legendre.com', '$2b$10$arq4hI1DJ/WtuFy3DmK88.zRtZaFIx60BQgNzV2o7.8x2/QYVxB9W', 'admin', NULL, NULL, '2026-04-13 12:26:25', '2026-04-13 12:26:25');
INSERT INTO `users` (`id`, `email`, `password`, `role`, `chauffeur_id`, `client_id`, `created_at`, `updated_at`) VALUES ('8067e7db-d4eb-4883-93ac-b18c9f14c430', 'claude.ia@legendre.fr', '$2b$10$7V0QhPw4VNjOpqKnGAFbdepqcgd0CFT8sn7ym2WXld4xDsfxqtx8S', 'chauffeur', 'd75dfefc-4c18-43f6-a970-782592cb23eb', NULL, '2026-04-13 13:24:05', '2026-04-13 13:24:05');
INSERT INTO `users` (`id`, `email`, `password`, `role`, `chauffeur_id`, `client_id`, `created_at`, `updated_at`) VALUES ('91ab9c5a-9cc1-46dc-afde-69fdbcabff8b', 'chauffeurtest@legendre.com', '$2b$10$3VGC//n74s1rFHD0ink0eOsimHeJ0ONJQbEVslBe5wUeRWzRJb/hu', 'chauffeur', NULL, NULL, '2026-04-13 12:27:37', '2026-04-13 12:27:37');
INSERT INTO `users` (`id`, `email`, `password`, `role`, `chauffeur_id`, `client_id`, `created_at`, `updated_at`) VALUES ('9c3994b6-2e32-45a6-bf44-4c3abe1370c1', 'commandes@legourmet.fr', '$2b$10$TKdgYycs20YT1fsL9uzjzuR8uRdJLsKCy1Wa4NXy7o5NEyE00z2ie', 'client', NULL, '395145ef-3e7f-49ad-8e35-46d90321c270', '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `users` (`id`, `email`, `password`, `role`, `chauffeur_id`, `client_id`, `created_at`, `updated_at`) VALUES ('b8225963-0e6a-4bf8-835f-1114e12bd08d', 'pierre.martin@legendre.fr', '$2b$10$TKdgYycs20YT1fsL9uzjzuR8uRdJLsKCy1Wa4NXy7o5NEyE00z2ie', 'chauffeur', '6a233b30-ae69-4133-84f5-625ef13ba15e', NULL, '2026-04-13 12:24:34', '2026-04-13 12:24:34');
INSERT INTO `users` (`id`, `email`, `password`, `role`, `chauffeur_id`, `client_id`, `created_at`, `updated_at`) VALUES ('c5ae194e-6f20-41a2-9a83-dd8b10d439df', 'test@legendre.fr', '$2b$10$JXpsH57Le2iJgkfg6I52wOTTZ/lHdYPdZWZdOWTPXdGQCs6zZOJWy', 'chauffeur', NULL, NULL, '2026-04-13 13:17:58', '2026-04-13 13:17:58');

SET FOREIGN_KEY_CHECKS = 1;
