/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Create UUID extension for PostgreSQL or UUID function for MySQL
  if (knex.client.config.client === 'pg') {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  }
  
  // Create users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    
    // Handle UUID generation based on database type
    if (knex.client.config.client === 'pg') {
      table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).notNullable().unique();
    } else {
      // For MySQL and other databases
      table.uuid('uuid').defaultTo(knex.raw('(UUID())')).notNullable().unique();
    }
    
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('role', 50).notNullable().defaultTo('user');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('last_login');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });

  // Create teams table
  await knex.schema.createTable('teams', (table) => {
    table.increments('id').primary();
    
    // Handle UUID generation based on database type
    if (knex.client.config.client === 'pg') {
      table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).notNullable().unique();
    } else {
      // For MySQL and other databases
      table.uuid('uuid').defaultTo(knex.raw('(UUID())')).notNullable().unique();
    }
    
    table.string('name', 255).notNullable();
    table.text('description');
    table.integer('owner_id').unsigned().notNullable();
    table.foreign('owner_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });

  // Create team_members table
  await knex.schema.createTable('team_members', (table) => {
    table.integer('team_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('team_id').references('id').inTable('teams').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('role', 50).defaultTo('member').notNullable();
    table.timestamp('joined_at').defaultTo(knex.fn.now()).notNullable();
    table.primary(['team_id', 'user_id']);
  });

  // Create projects table
  await knex.schema.createTable('projects', (table) => {
    table.increments('id').primary();
    
    // Handle UUID generation based on database type
    if (knex.client.config.client === 'pg') {
      table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).notNullable().unique();
    } else {
      // For MySQL and other databases
      table.uuid('uuid').defaultTo(knex.raw('(UUID())')).notNullable().unique();
    }
    
    table.string('name', 255).notNullable();
    table.text('description');
    table.integer('team_id').unsigned().notNullable();
    table.foreign('team_id').references('id').inTable('teams').onDelete('CASCADE');
    table.string('status', 50).defaultTo('active').notNullable();
    table.timestamp('start_date');
    table.timestamp('end_date');
    table.json('metadata');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });

  // Create settings table
  await knex.schema.createTable('settings', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('theme', 50).defaultTo('light').notNullable();
    table.boolean('notifications').defaultTo(true);
    table.string('language', 10).defaultTo('en').notNullable();
    table.json('preferences');
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('settings');
  await knex.schema.dropTableIfExists('projects');
  await knex.schema.dropTableIfExists('team_members');
  await knex.schema.dropTableIfExists('teams');
  await knex.schema.dropTableIfExists('users');
} 