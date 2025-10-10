/**
 * Clean production seed - Essential data for new deployments
 *
 * This seed creates:
 * 1. Default admin user (email: admin@example.com, password: admin123)
 * 2. Default demo user (email: user@example.com, password: user123)
 * 3. System configuration with default branding and theme
 * 4. User settings for both admin and demo user
 * 5. Default menu structures for admin and user roles
 *
 * IMPORTANT: Change the admin password after first login!
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // ======================
  // 1. USERS
  // ======================
  // Create default admin user (can be overridden by API during setup with wizard credentials)
  const existingAdmin = await knex('users').where('email', 'admin@example.com').first();

  if (!existingAdmin) {
    await knex('users').insert({
      name: 'Admin',
      email: 'admin@example.com',
      // Password: admin123 (bcrypt hash)
      password: '$2b$10$MtlKaw.VGUci/Gtneu.CHO6YsNjc.D4SiVFqAJPOhzh0LCeh2yFiq',
      role: 'admin',
      is_active: true
    });
  }

  // Create demo user
  const existingUser = await knex('users').where('email', 'user@example.com').first();

  if (!existingUser) {
    await knex('users').insert({
      name: 'Demo User',
      email: 'user@example.com',
      // Password: user123 (bcrypt hash)
      password: '$2b$10$YaB6xpBcJe8Nc7rtAa7ryeGMOvZxHGRIHKL.0qK1Yb6ZWWX1q1Zy6',
      role: 'user',
      is_active: true
    });
  }

  // ======================
  // 2. SYSTEM CONFIGURATION
  // ======================
  // Upsert system configuration (insert if not exists, skip if exists)
  const configItems = [
    {
      key: 'systemName',
      value: 'Your System Name',
      type: 'string',
      description: 'System name displayed in header and page titles',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      key: 'logoLight',
      value: '/vite.svg',
      type: 'string',
      description: 'Light mode logo path (default: Vite logo)',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      key: 'logoDark',
      value: '/vite.svg',
      type: 'string',
      description: 'Dark mode logo path (default: Vite logo)',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      key: 'loginImage',
      value: '',
      type: 'string',
      description: 'Login page background image path',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      key: 'loginTitle',
      value: 'Welcome Back',
      type: 'string',
      description: 'Login page title',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      key: 'loginDescription',
      value: 'Sign in to your account to continue',
      type: 'string',
      description: 'Login page description',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      key: 'loginLogoMode',
      value: 'theme',
      type: 'string',
      description: 'Login logo mode: light, dark, or theme (follows system theme)',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      key: 'loginLogoSize',
      value: 'large',
      type: 'string',
      description: 'Login logo size: small, medium, large, or custom',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      key: 'loginLogoCustomSize',
      value: '200',
      type: 'number',
      description: 'Custom login logo size in pixels (only used if loginLogoSize=custom)',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      key: 'configSource',
      value: 'db',
      type: 'string',
      description: 'Configuration source: db (database) or file (system-config.json)',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      key: 'themeColor',
      value: 'zinc',
      type: 'string',
      description: 'Theme color scheme',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      key: 'themeRadius',
      value: '0.5',
      type: 'number',
      description: 'Theme border radius',
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  for (const item of configItems) {
    const existing = await knex('system_configuration').where('key', item.key).first();

    if (!existing) {
      await knex('system_configuration').insert(item);
    }
  }

  // ======================
  // 3. USER SETTINGS
  // ======================
  // Create settings for all users who don't have settings yet
  const users = await knex('users').select('id');

  for (const user of users) {
    const existingSettings = await knex('settings').where('user_id', user.id).first();

    if (!existingSettings) {
      await knex('settings').insert({
        user_id: user.id,
        theme: 'system',
        notifications: true,
        language: 'en',
        preferences: JSON.stringify({
          sidebar_collapsed: false,
          dense_mode: false,
          show_tooltips: true
        })
      });
    }
  }

  // ======================
  // 4. PAGES (User-created pages)
  // ======================
  // No default pages - users create them via Page Editor

  // ======================
  // 5. MENU STRUCTURES
  // ======================
  // Only create menu structures if they don't exist

  // Admin menu structure
  const adminMenuStructure = [
    {
      id: 'cat-main',
      label: 'Main',
      type: 'category',
      order: 0,
      items: [
        {
          id: 'admin-home',
          label: 'Home',
          path: '/admin/home',
          icon: 'LayoutDashboard',
          type: 'item',
          order: 0
        }
      ]
    },
    {
      id: 'cat-system',
      label: 'System',
      type: 'category',
      order: 1,
      items: [
        {
          id: 'admin-configuration',
          label: 'Configuration',
          path: '/configuration',
          icon: 'Settings',
          type: 'item',
          order: 0
        },
        {
          id: 'admin-page-editor',
          label: 'Page Editor',
          path: '/admin/page-editor',
          icon: 'BookOpen',
          type: 'item',
          order: 1
        },
        {
          id: 'admin-menu-editor',
          label: 'Menu Editor',
          path: '/admin/menu-editor',
          icon: 'Wrench',
          type: 'item',
          order: 2
        },
        {
          id: 'admin-system-status',
          label: 'System Status',
          path: '/admin/system-status',
          icon: 'Activity',
          type: 'item',
          order: 3
        }
      ]
    }
  ];

  // User menu structure
  const userMenuStructure = [
    {
      id: 'cat-main',
      label: 'Main',
      type: 'category',
      order: 0,
      items: [
        {
          id: 'user-home',
          label: 'Home',
          path: '/user/home',
          icon: 'LayoutDashboard',
          type: 'item',
          order: 0
        }
      ]
    }
  ];

  // Insert menu structures only if they don't exist
  const existingAdminMenu = await knex('menu_structures').where('role', 'admin').first();
  if (!existingAdminMenu) {
    await knex('menu_structures').insert({
      role: 'admin',
      structure: JSON.stringify(adminMenuStructure),
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  const existingUserMenu = await knex('menu_structures').where('role', 'user').first();
  if (!existingUserMenu) {
    await knex('menu_structures').insert({
      role: 'user',
      structure: JSON.stringify(userMenuStructure),
      created_at: new Date(),
      updated_at: new Date()
    });
  }
}
