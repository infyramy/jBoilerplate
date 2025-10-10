-- =====================================================
-- jBoilerplate Database Schema
-- Generated for MySQL 8.0+
-- =====================================================

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS jboilerplate_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE jboilerplate_dev;

-- =====================================================
-- Table: users
-- Purpose: User accounts and authentication
-- =====================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user' COMMENT 'admin|user',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_uuid_unique` (`uuid`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_index` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: system_configuration
-- Purpose: Application-wide settings
-- =====================================================
CREATE TABLE IF NOT EXISTS `system_configuration` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'string' COMMENT 'string|number|boolean|json',
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `system_configuration_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: pages
-- Purpose: User-created dynamic pages
-- =====================================================
CREATE TABLE IF NOT EXISTS `pages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `component_path` varchar(255) NOT NULL,
  `layout` varchar(255) NOT NULL DEFAULT 'dashboard' COMMENT 'dashboard|auth|forms|blank',
  `role` varchar(50) NOT NULL DEFAULT 'user' COMMENT 'all|admin|user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pages_path_unique` (`path`),
  KEY `pages_role_index` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: menu_structures
-- Purpose: Menu organization per role
-- =====================================================
CREATE TABLE IF NOT EXISTS `menu_structures` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role` varchar(50) NOT NULL COMMENT 'admin|user',
  `structure` text NOT NULL COMMENT 'JSON: [{id,label,type,order,items:[...]}]',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `menu_structures_role_unique` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: knex_migrations
-- Purpose: Track database migrations
-- =====================================================
CREATE TABLE IF NOT EXISTS `knex_migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: knex_migrations_lock
-- Purpose: Lock table for migrations
-- =====================================================
CREATE TABLE IF NOT EXISTS `knex_migrations_lock` (
  `index` int unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Seed Data: Default Admin User
-- =====================================================
INSERT INTO `users` (`uuid`, `name`, `email`, `password`, `role`, `is_active`, `created_at`, `updated_at`)
VALUES (UUID(), 'Admin User', 'admin@example.com', '$2b$10$YaB6xpBcJe8Nc7rtAa7ryeGMOvZxHGRIHKL.0qK1Yb6ZWWX1q1Zy6', 'admin', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `email` = `email`;
-- Note: Default password is 'admin123' - CHANGE IMMEDIATELY AFTER FIRST LOGIN!

-- =====================================================
-- Seed Data: System Configuration
-- =====================================================
INSERT INTO `system_configuration` (`key`, `value`, `type`, `description`, `created_at`, `updated_at`) VALUES
('systemName', 'jBoilerplate', 'string', 'System name displayed in header and page titles', NOW(), NOW()),
('logoLight', '/vite.svg', 'string', 'Light mode logo path (default: Vite logo)', NOW(), NOW()),
('logoDark', '/vite.svg', 'string', 'Dark mode logo path (default: Vite logo)', NOW(), NOW()),
('loginImage', '', 'string', 'Login page background image path', NOW(), NOW()),
('loginTitle', 'Welcome Back', 'string', 'Login page title', NOW(), NOW()),
('loginDescription', 'Sign in to your account to continue', 'string', 'Login page description', NOW(), NOW()),
('loginLogoMode', 'theme', 'string', 'Login logo mode: light, dark, or theme (follows system theme)', NOW(), NOW()),
('loginLogoSize', 'large', 'string', 'Login logo size: small, medium, large, or custom', NOW(), NOW()),
('loginLogoCustomSize', '200', 'number', 'Custom login logo size in pixels (only used if loginLogoSize=custom)', NOW(), NOW()),
('configSource', 'db', 'string', 'Configuration source: db (database) or file (system-config.json)', NOW(), NOW())
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- =====================================================
-- Seed Data: Menu Structures
-- =====================================================

-- Admin menu structure
INSERT INTO `menu_structures` (`role`, `structure`, `created_at`, `updated_at`)
VALUES (
  'admin',
  '[{"id":"cat-main","label":"Main","type":"category","order":0,"items":[{"id":"admin-home","label":"Home","path":"/admin/home","icon":"LayoutDashboard","type":"item","order":0}]},{"id":"cat-system","label":"System","type":"category","order":1,"items":[{"id":"admin-configuration","label":"Configuration","path":"/configuration","icon":"Settings","type":"item","order":0},{"id":"admin-page-editor","label":"Page Editor","path":"/admin/page-editor","icon":"BookOpen","type":"item","order":1},{"id":"admin-menu-editor","label":"Menu Editor","path":"/admin/menu-editor","icon":"Wrench","type":"item","order":2}]}]',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE `structure` = VALUES(`structure`);

-- User menu structure
INSERT INTO `menu_structures` (`role`, `structure`, `created_at`, `updated_at`)
VALUES (
  'user',
  '[{"id":"cat-main","label":"Main","type":"category","order":0,"items":[{"id":"user-home","label":"Home","path":"/user/home","icon":"LayoutDashboard","type":"item","order":0}]}]',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE `structure` = VALUES(`structure`);

-- =====================================================
-- Initial migration record
-- =====================================================
INSERT INTO `knex_migrations` (`name`, `batch`, `migration_time`)
VALUES ('20251008000000_clean_production_schema.js', 1, NOW())
ON DUPLICATE KEY UPDATE `name` = `name`;

-- =====================================================
-- Setup Complete!
-- =====================================================
-- Next steps:
-- 1. Login with: admin@example.com / admin123
-- 2. CHANGE THE DEFAULT PASSWORD immediately!
-- 3. Customize your system via Configuration page
-- 4. Create pages via Page Editor
-- 5. Organize menus via Menu Editor
-- =====================================================
