import knex from 'knex';
import knexConfig from '../knexfile.js';

const db = knex(knexConfig.development);

async function resetMenuStructure() {
  try {
    console.log('Deleting saved menu structures...');
    await db('menu_structures').delete();
    console.log('✓ Menu structures deleted successfully');
    console.log('The menu editor will now use the updated default structure');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting menu structure:', error);
    process.exit(1);
  }
}

resetMenuStructure();
