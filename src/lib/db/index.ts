import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { configService } from '@/services/config';
import * as schema from './schema';

// Get database configuration from config service
const getDbConfig = () => {
  const env = configService.environment;
  
  const configs = {
    development: {
      host: configService.database.host,
      port: configService.database.port,
      user: configService.database.user,
      password: configService.database.password,
      database: configService.database.name,
    },
    staging: {
      host: configService.database.host,
      port: configService.database.port,
      user: configService.database.user,
      password: configService.database.password,
      database: configService.database.name || 'jboilerplate_staging',
      ssl: { rejectUnauthorized: false }
    },
    production: {
      host: configService.database.host,
      port: configService.database.port,
      user: configService.database.user,
      password: configService.database.password,
      database: configService.database.name || 'jboilerplate_prod',
      ssl: { rejectUnauthorized: false }
    }
  };
  
  return configs[env as keyof typeof configs] || configs.development;
};

// Create the database pool
const pool = new Pool(getDbConfig());

// Create the Drizzle ORM client
export const db = drizzle(pool, { schema });

// Export schema for use in migrations and queries
export { schema }; 