/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Check if System Status menu item already exists
  const existingSystemStatus = await knex('menus')
    .where({ label: 'System Status', role: 'admin', path: '/admin/system-status' })
    .first();

  if (!existingSystemStatus) {
    // Add System Status menu item
    await knex('menus').insert({
      label: 'System Status',
      role: 'admin',
      icon: 'Activity',
      path: '/admin/system-status',
      order: 50, // Position in menu
      visible: true,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
}
