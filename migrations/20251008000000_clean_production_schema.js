/**
 * Clean production schema - Essential tables only
 * This migration creates only the tables needed for the application to function.
 *
 * Tables:
 * - users: User accounts (admin, user roles)
 * - system_configuration: System settings (name, logos, branding)
 * - pages: User-created pages via Page Editor
 * - menu_structures: Menu organization per role
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // 1. Users table - Core authentication
  if (!await knex.schema.hasTable('users')) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();

      // UUID for external references
      if (knex.client.config.client === 'pg') {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).notNullable().unique();
      } else {
        table.uuid('uuid').defaultTo(knex.raw('(UUID())')).notNullable().unique();
      }

      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('password', 255).notNullable();
      table.string('role', 50).notNullable().defaultTo('user').comment('admin|user');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('last_login');
      table.timestamps(true, true); // created_at, updated_at
    });
  }

  // 2. System configuration - Application settings
  if (!await knex.schema.hasTable('system_configuration')) {
    await knex.schema.createTable('system_configuration', (table) => {
      table.increments('id').primary();
      table.string('key', 100).notNullable().unique();
      table.text('value').notNullable();
      table.string('type', 50).notNullable().defaultTo('string').comment('string|number|boolean|json');
      table.text('description');
      table.timestamps(true, true);
    });
  }

  // 3. Pages table - User-created pages
  if (!await knex.schema.hasTable('pages')) {
    await knex.schema.createTable('pages', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('path').notNullable().unique();
      table.string('component_path').notNullable();
      table.string('layout').notNullable().defaultTo('dashboard').comment('dashboard|auth|forms|blank');
      table.string('role').notNullable().defaultTo('user').comment('all|admin|user');
      table.timestamps(true, true);
    });
  }

  // 4. Menu structures - Menu organization per role
  if (!await knex.schema.hasTable('menu_structures')) {
    await knex.schema.createTable('menu_structures', (table) => {
      table.increments('id').primary();
      table.string('role').notNullable().unique().comment('admin|user');
      table.text('structure').notNullable().comment('JSON: [{id,label,type,order,items:[...]}]');
      table.timestamps(true, true);
    });
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('menu_structures');
  await knex.schema.dropTableIfExists('pages');
  await knex.schema.dropTableIfExists('system_configuration');
  await knex.schema.dropTableIfExists('users');
}
