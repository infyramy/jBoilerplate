/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // modules table
  const hasModules = await knex.schema.hasTable('modules');
  if (!hasModules) {
    await knex.schema.createTable('modules', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('type', 50).notNullable(); // page|component|store|endpoint
      table.text('payload').notNullable(); // JSON string of generation data
      table.string('created_by', 255).notNullable();
      table.string('ip', 64);
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
  }

  // audit_logs table
  const hasAudit = await knex.schema.hasTable('audit_logs');
  if (!hasAudit) {
    await knex.schema.createTable('audit_logs', (table) => {
      table.increments('id').primary();
      table.string('user', 255).notNullable();
      table.string('action', 100).notNullable();
      table.text('details').notNullable(); // JSON string
      table.string('ip', 64);
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  const dropIfExists = async (t) => knex.schema.hasTable(t).then(exists => exists && knex.schema.dropTable(t));
  await dropIfExists('audit_logs');
  await dropIfExists('modules');
}
