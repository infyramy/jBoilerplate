/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const hasTable = await knex.schema.hasTable('system_logs');
  if (!hasTable) {
    await knex.schema.createTable('system_logs', (table) => {
      table.increments('id').primary();
      table.string('type', 50).notNullable(); // status|audit|security|boot|migration|setup
      table.string('level', 20).notNullable().defaultTo('info'); // info|warn|error
      table.text('message').notNullable();
      table.json('meta'); // Additional metadata (JSON)
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

      // Indexes for better query performance
      table.index(['type', 'created_at'], 'idx_type_created');
      table.index(['level', 'created_at'], 'idx_level_created');
      table.index('created_at', 'idx_created');
    });
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('system_logs');
}
