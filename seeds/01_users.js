/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Clean the tables
  await knex('settings').del();
  await knex('projects').del();
  await knex('team_members').del();
  await knex('teams').del();
  await knex('users').del();

  // Insert admin user
  const [adminUserId] = await knex('users').insert({
    name: 'Admin User',
    email: 'admin@example.com',
    // Default password: admin123 (should be changed in production)
    password: '$2b$10$YaB6xpBcJe8Nc7rtAa7ryeGMOvZxHGRIHKL.0qK1Yb6ZWWX1q1Zy6',
    role: 'admin',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Insert default team
  const [defaultTeamId] = await knex('teams').insert({
    name: 'Default Team',
    description: 'Default team for the organization',
    owner_id: adminUserId,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Add admin user to default team
  await knex('team_members').insert({
    team_id: defaultTeamId,
    user_id: adminUserId,
    role: 'owner',
    joined_at: new Date()
  });

  // Insert default project
  await knex('projects').insert({
    name: 'Welcome Project',
    description: 'Welcome to your new workspace! This is a sample project to help you get started.',
    team_id: defaultTeamId,
    status: 'active',
    start_date: new Date(),
    metadata: JSON.stringify({
      type: 'onboarding',
      priority: 'medium'
    }),
    created_at: new Date(),
    updated_at: new Date()
  });

  // Insert admin user settings
  await knex('settings').insert({
    user_id: adminUserId,
    theme: 'system',
    notifications: true,
    language: 'en',
    preferences: JSON.stringify({
      sidebar_collapsed: false,
      email_notifications: true,
      desktop_notifications: true
    }),
    updated_at: new Date()
  });
} 