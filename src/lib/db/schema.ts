/**
 * This file serves as a template for creating Knex.js migrations
 * Use this as a reference when creating new migrations with `knex migrate:make`
 */

import { Knex } from 'knex';

/**
 * Example migration to create users table
 */
export async function up(knex: Knex): Promise<void> {
  // Create users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).notNullable().unique();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('role', 50).notNullable().defaultTo('user');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('last_login', { useTz: true });
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
  });

  // Create teams table
  await knex.schema.createTable('teams', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).notNullable().unique();
    table.string('name', 255).notNullable();
    table.text('description');
    table.integer('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
  });

  // Create team_members table
  await knex.schema.createTable('team_members', (table) => {
    table.integer('team_id').notNullable().references('id').inTable('teams').onDelete('CASCADE');
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('role', 50).defaultTo('member').notNullable();
    table.timestamp('joined_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
    table.primary(['team_id', 'user_id']);
  });

  // Create projects table
  await knex.schema.createTable('projects', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).notNullable().unique();
    table.string('name', 255).notNullable();
    table.text('description');
    table.integer('team_id').notNullable().references('id').inTable('teams').onDelete('CASCADE');
    table.string('status', 50).defaultTo('active').notNullable();
    table.timestamp('start_date', { useTz: true });
    table.timestamp('end_date', { useTz: true });
    table.jsonb('metadata');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
  });

  // Create settings table
  await knex.schema.createTable('settings', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('theme', 50).defaultTo('light').notNullable();
    table.boolean('notifications').defaultTo(true);
    table.string('language', 10).defaultTo('en').notNullable();
    table.jsonb('preferences');
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
  });

  // Optional: Create UUID extension if using PostgreSQL
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
}

/**
 * Example migration to drop tables
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('settings');
  await knex.schema.dropTableIfExists('projects');
  await knex.schema.dropTableIfExists('team_members');
  await knex.schema.dropTableIfExists('teams');
  await knex.schema.dropTableIfExists('users');
}