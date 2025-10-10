import knex from 'knex';
import knexConfig from '../knexfile.js';

const db = knex(knexConfig.development);

async function cleanOrphanedMigrations() {
  try {
    const deleted = await db('knex_migrations')
      .whereIn('name', [
        '20251006064135_create_subsidy_checks_tables.cjs',
        '20251006064321_create_ideaspark_table.cjs',
        '20251006071912_create_claims_tables.cjs'
      ])
      .del();

    console.log(`Deleted ${deleted} orphaned migration records`);
    await db.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    await db.destroy();
    process.exit(1);
  }
}

cleanOrphanedMigrations();
