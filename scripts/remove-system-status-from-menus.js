import knex from 'knex';
import knexConfig from '../knexfile.js';

const db = knex(knexConfig.development);

async function removeSystemStatusFromMenus() {
  try {
    console.log('Removing System Status from menus table...');
    const deleted = await db('menus')
      .where({ path: '/admin/system-status' })
      .delete();

    if (deleted > 0) {
      console.log(`✓ Removed ${deleted} System Status entry from menus table`);
      console.log('System Status is now managed in the static navigation (System group)');
    } else {
      console.log('No System Status entry found in menus table');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error removing System Status:', error);
    process.exit(1);
  }
}

removeSystemStatusFromMenus();
