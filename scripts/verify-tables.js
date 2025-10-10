import knex from 'knex';
import knexConfig from '../knexfile.js';

const db = knex(knexConfig.development);

async function verifyTables() {
  try {
    const hasAudit = await db.schema.hasTable('audit_logs');
    const hasModules = await db.schema.hasTable('modules');

    console.log('✓ audit_logs table exists:', hasAudit);
    console.log('✓ modules table exists:', hasModules);

    if (hasAudit) {
      const auditCount = await db('audit_logs').count('* as count').first();
      console.log('  audit_logs records:', auditCount.count);
    }

    if (hasModules) {
      const modulesCount = await db('modules').count('* as count').first();
      console.log('  modules records:', modulesCount.count);
    }

    await db.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    await db.destroy();
    process.exit(1);
  }
}

verifyTables();
