/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Change value column from TEXT to LONGTEXT to support large base64 images
  await knex.schema.alterTable('system_configuration', (table) => {
    table.specificType('value', 'LONGTEXT').notNullable().alter();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Revert back to TEXT
  await knex.schema.alterTable('system_configuration', (table) => {
    table.text('value').notNullable().alter();
  });
}
