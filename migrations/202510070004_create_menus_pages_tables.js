export async function up(knex) {
  if (!await knex.schema.hasTable('menus')) {
    await knex.schema.createTable('menus', (t) => {
      t.increments('id').primary();
      t.string('label').notNullable();
      t.string('path').notNullable().unique();
      t.string('icon');
      t.integer('order').notNullable().defaultTo(0);
      t.string('role').notNullable().defaultTo('user'); // admin|user
      t.boolean('visible').notNullable().defaultTo(true);
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
  if (!await knex.schema.hasTable('pages')) {
    await knex.schema.createTable('pages', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.string('path').notNullable().unique();
      t.string('component_path').notNullable();
      t.string('layout').notNullable().defaultTo('dashboard');
      t.string('role').notNullable().defaultTo('user');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex) {
  const dropIfExists = async (t) => knex.schema.hasTable(t).then(exists => exists && knex.schema.dropTable(t));
  await dropIfExists('pages');
  await dropIfExists('menus');
}
