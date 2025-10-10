export async function up(knex) {
  if (!await knex.schema.hasTable('menu_structures')) {
    await knex.schema.createTable('menu_structures', (t) => {
      t.increments('id').primary();
      t.string('role').notNullable().unique(); // admin|user
      t.text('structure').notNullable(); // JSON string
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex) {
  if (await knex.schema.hasTable('menu_structures')) {
    await knex.schema.dropTable('menu_structures');
  }
}
